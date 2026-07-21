import { Injectable, Logger } from '@nestjs/common';
import { NotificationsRepo } from 'src/repository/notifications.repo';
import { ConnectorRepo } from 'src/repository/connectors.repo';
import { ParsedMessage } from 'src/utils/types';
import { SamplesDto } from '@shared/dto/SamplesDto';
import { CreateTransactionsDto } from '@shared/types/Transaction';
import { ConnectorDto } from '@shared/dto/ConnectorDto';
import {
  AppNotification,
  FinishNotificationDto,
  FinishNotificationResult,
} from '@shared/types/Notification';
import { WireTypes } from '@shared/enums/WireTypes';
import { UpdateConnectorDto } from 'src/dtos/connector.dto';

type ConnectorStockUpdateData = {
  codivmac: string;
  Qty: number;
  Qty_com_fio: number;
  Qty_sem_fio: number;
  updatedBy: string;
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(
    private readonly notificationsRepo: NotificationsRepo,
    private readonly connectorRepo: ConnectorRepo,
  ) {}

  /** Get all unfinished notifications with parsed data */
  async getUnfinishedNotifications(): Promise<AppNotification[]> {
    const notifications =
      await this.notificationsRepo.getUnfinishedNotifications();

    return notifications.map((notification) => {
      const parsed = this.parseNotificationMessage(notification.Message);
      return {
        ...notification,
        parsedConector: parsed.conector,
        parsedEncomenda: parsed.encomenda,
        parsedProdId: parsed.prodId,
        parsedWireType: parsed?.wireType,
        parsedSample: parsed?.sample,
      };
    });
  }

  /** Get notification with linked sample and connector */
  async getNotificationExtended(id: number): Promise<AppNotification | null> {
    const notification = await this.notificationsRepo.getNotificationById(id);
    if (!notification) {
      return null;
    }

    // Parse message to extract connector and encomenda
    const parsed = this.parseNotificationMessage(notification.Message);

    // Try to find matching sample and connector
    const { linkedSample, linkedConnector } =
      await this.findLinkedSampleAndConnector(parsed);

    return {
      ...notification,
      parsedConector: parsed.conector,
      parsedEncomenda: parsed.encomenda,
      parsedProdId: parsed.prodId,
      parsedWireType: parsed.wireType,
      parsedSample: parsed.sample,
      linkedSample,
      linkedConnector,
    };
  }

  private async resolveEffectiveConnector(
    notification: AppNotification,
    connectorVersionId?: string,
  ): Promise<ConnectorDto | null> {
    if (notification.linkedConnector) return notification.linkedConnector;
    if (connectorVersionId)
      return this.connectorRepo.getConnectorByCodivmac(connectorVersionId);
    return null;
  }

  /** Mark notification as finished and optionally update connector quantity */
  async finishNotification(
    dto: FinishNotificationDto,
  ): Promise<FinishNotificationResult> {
    // Get notification with sample
    const { notificationId, connectorVersionId } = dto;
    const notificationData = await this.getNotificationExtended(notificationId);
    if (!notificationData)
      throw new Error(`Notification with ID ${notificationId} not found`);

    // Determine effective connector to update
    const effectiveConnector = await this.resolveEffectiveConnector(
      notificationData,
      connectorVersionId,
    );

    let connectorStockUpdate: ConnectorStockUpdateData | undefined;
    let transactionDto: CreateTransactionsDto | undefined;
    let stockUpdateWarning: string | undefined;

    try {
      const updateConnectorDto = this.buildConnectorUpdate(
        dto,
        notificationData,
        effectiveConnector,
      );
      transactionDto = this.buildTransactionDto(
        dto,
        notificationData,
        effectiveConnector,
      );
      connectorStockUpdate = this.buildConnectorStockUpdate(
        updateConnectorDto,
        effectiveConnector,
      );
    } catch (error) {
      stockUpdateWarning = this.getStockUpdateWarning(error);
      this.logger.warn(stockUpdateWarning);
    }

    const finishedNotification =
      await this.notificationsRepo.finishNotification(
        dto.notificationId,
        dto.completionNote,
      );

    if (!stockUpdateWarning && (connectorStockUpdate || transactionDto)) {
      try {
        await this.notificationsRepo.applyFinishSideEffects(
          connectorStockUpdate,
          transactionDto,
        );
      } catch (error) {
        stockUpdateWarning = this.getStockUpdateWarning(error);
        this.logger.error(
          stockUpdateWarning,
          error instanceof Error ? error.stack : undefined,
        );
      }
    }

    return {
      notification: finishedNotification,
      stockUpdateFailed: !!stockUpdateWarning,
      warning: stockUpdateWarning,
    };
  }

  /** Mark notification as read */
  async markAsRead(id: number) {
    return this.notificationsRepo.markAsRead(id);
  }

  /**
   * Parse notification message to extract connector and encomenda
   * Expected format:
   * Pedido de amostra para montagem
   * Conector: I357C2
   * Encomenda: 251120
   * ProdId= 274886
   */
  parseNotificationMessage(message: string): ParsedMessage {
    const parsed: ParsedMessage = {};

    const conectorMatch = message
      .split('Order')[0]
      .match(/(?:Conector|Connector):\s*(\S+)/i);
    if (conectorMatch && conectorMatch?.length > 1) {
      parsed.conector = conectorMatch[1];
    } else {
      parsed.conector = '?';
    }
    // const conectorMatch = message.match(/(?:Conector|Connector):\s*(\S+)/i);
    // if (conectorMatch) parsed.conector = conectorMatch[1];

    const encomendaMatch = message.match(/(?:Order):\s*(\d+)/i);
    if (encomendaMatch) parsed.encomenda = encomendaMatch[1];

    const prodIdMatch = message.match(/ProdId=\s*(\d+)/i);
    if (prodIdMatch) parsed.prodId = prodIdMatch[1];

    const wireMatch = message.match(/^Wire\s*:\s*(.+)$/im);
    if (wireMatch && wireMatch[1]?.trim()?.toLowerCase()?.includes('wire')) {
      parsed.wireType = wireMatch[1]?.trim();
    }

    // cleaner sample parsing
    const sampleMatch = message.match(
      /(?:Sample|Amostra)\s*:\s*:?\s*([^\r\n]*)/i,
    );
    if (sampleMatch && sampleMatch[1].trim()) {
      parsed.sample = sampleMatch[1].trim();
    }

    return parsed;
  }

  private findLinkedSampleAndConnector = async (parsed: ParsedMessage) => {
    let linkedSample: SamplesDto | undefined;
    let linkedConnector: ConnectorDto | undefined;

    if (parsed.conector) {
      linkedConnector =
        (await this.connectorRepo.getConnectorByCodivmac(parsed.conector)) ??
        undefined;

      if (parsed.encomenda) {
        linkedSample =
          (await this.notificationsRepo.findMatchingSample(
            parsed.conector,
            parsed.encomenda,
          )) ?? undefined;
      }
    }

    return { linkedSample, linkedConnector };
  };

  private buildConnectorUpdate(
    dto: FinishNotificationDto,
    notification: AppNotification,
    connector: ConnectorDto | null,
  ): UpdateConnectorDto | undefined {
    const { quantityTakenOut, subType, finishedBy } = dto;

    if (quantityTakenOut <= 0) return undefined;

    if (!connector && notification.parsedConector?.includes('-')) {
      throw new Error(
        'Cannot take stock out: please select a specific connector version',
      );
    }

    if (notification.linkedConnector && !subType) {
      throw new Error(
        'Wire type is required when taking stock out (COM_FIO or SEM_FIO)',
      );
    }

    return {
      codivmac: connector?.CODIVMAC ?? '',
      quantityTakenOut,
      subType: subType as WireTypes,
      updatedBy: finishedBy || 'system',
    };
  }

  private buildTransactionDto(
    dto: FinishNotificationDto,
    notification: AppNotification,
    connector: ConnectorDto | null,
  ): CreateTransactionsDto | undefined {
    const connectorId =
      connector?.CODIVMAC ??
      dto.connectorVersionId ??
      notification.parsedConector;

    if (!connectorId) {
      this.logger.log(
        'Skipping transaction logging: No connector ID available',
      );
      return undefined;
    }

    return {
      itemId: connectorId,
      transactionType: 'OUT',
      amount: Number(dto.quantityTakenOut) || 0,
      itemType: 'connector',
      subType: dto.subType,
      department: notification.SenderSector ?? '',
      sender: notification.SenderUser,
      notes: dto.completionNote,
      encomenda: notification.parsedEncomenda,
      prodId: notification.parsedProdId,
    };
  }

  private buildConnectorStockUpdate(
    connectorUpdate: UpdateConnectorDto | undefined,
    connector: ConnectorDto | null,
  ): ConnectorStockUpdateData | undefined {
    if (!connectorUpdate?.codivmac) {
      return undefined;
    }

    if (!connector) {
      throw new Error(
        `Connector not found for stock update: ${connectorUpdate.codivmac}`,
      );
    }

    const currentWithWire = connector.Qty_com_fio ?? 0;
    const currentWithoutWire = connector.Qty_sem_fio ?? 0;
    const take = Math.max(0, Number(connectorUpdate.quantityTakenOut) || 0);

    let newWithWire = currentWithWire;
    let newWithoutWire = currentWithoutWire;

    if (connectorUpdate.subType === WireTypes.COM_FIO) {
      newWithWire = Math.max(0, currentWithWire - take);
    } else if (connectorUpdate.subType === WireTypes.SEM_FIO) {
      newWithoutWire = Math.max(0, currentWithoutWire - take);
    }

    return {
      codivmac: connectorUpdate.codivmac,
      Qty: newWithWire + newWithoutWire,
      Qty_com_fio: newWithWire,
      Qty_sem_fio: newWithoutWire,
      updatedBy: connectorUpdate.updatedBy,
    };
  }

  private getStockUpdateWarning(error: unknown): string {
    const details =
      error instanceof Error && error.message
        ? error.message
        : 'Unknown stock update error';

    return `Notification was finished, but the stock update failed: ${details}`;
  }
}

import { Injectable } from '@nestjs/common';
import { NotificationsRepo } from 'src/repository/notifications.repo';
import { ConnectorRepo } from 'src/repository/connectors.repo';
import { ParsedMessage } from 'src/utils/types';
import { SamplesDto } from '@shared/dto/SamplesDto';
import { CreateTransactionsDto } from '@shared/types/Transaction';
import { ConnectorDto } from '@shared/dto/ConnectorDto';
import { AppNotification } from '@shared/types/Notification';
import { WireTypes } from '@shared/enums/WireTypes';

@Injectable()
export class NotificationsService {
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

  /** Get notification with linked sample if exists */
  async getNotificationWithSample(id: number): Promise<AppNotification | null> {
    const notification = await this.notificationsRepo.getNotificationById(id);
    if (!notification) {
      return null;
    }

    // Parse message to extract connector and encomenda
    const parsed = this.parseNotificationMessage(notification.Message);

    // Try to find matching sample and connector
    let linkedSample: SamplesDto | null = null;
    let linkedConnector: ConnectorDto | null = null;

    if (parsed.conector) {
      linkedConnector = await this.connectorRepo.getConnectorByCodivmac(
        parsed.conector,
      );

      if (parsed.encomenda) {
        linkedSample = await this.notificationsRepo.findMatchingSample(
          parsed.conector,
          parsed.encomenda,
        );
      }
    }

    return {
      ...notification,
      parsedConector: parsed.conector,
      parsedEncomenda: parsed.encomenda,
      parsedProdId: parsed.prodId,
      parsedWireType: parsed.wireType,
      parsedSample: parsed.sample,
      linkedSample: linkedSample || undefined,
      linkedConnector: linkedConnector || undefined,
    };
  }

  /** Mark notification as finished and optionally update sample quantity */
  async finishNotification(
    id: number,
    quantityTakenOut: number,
    subType?: WireTypes,
    finishedBy?: string,
    completionNote?: string,
  ): Promise<AppNotification> {
    // Get notification with sample
    const notificationData = await this.getNotificationWithSample(id);
    if (!notificationData) {
      throw new Error(`Notification with ID ${id} not found`);
    }

    let connectorUpdate:
      | {
          codivmac: string;
          quantityTakenOut: number;
          subType: WireTypes;
          updatedBy: string;
        }
      | undefined;

    // If linked connector exists and we are taking stock out, require wire subtype
    if (notificationData.linkedConnector && quantityTakenOut > 0) {
      if (!subType) {
        throw new Error(
          'Wire type is required when taking stock out (COM_FIO or SEM_FIO)',
        );
      }

      connectorUpdate = {
        codivmac: notificationData.linkedConnector.CODIVMAC,
        quantityTakenOut,
        subType,
        updatedBy: finishedBy || 'system',
      };
    }

    // Prepare transaction if applicable
    let transactionDto: CreateTransactionsDto | undefined;

    // Use extracted connector from message if linked connector doesn't exist
    const connectorId =
      notificationData.linkedConnector?.CODIVMAC ??
      notificationData.parsedConector;

    if (connectorId) {
      transactionDto = {
        itemId: connectorId,
        transactionType: 'OUT',
        amount: Number(quantityTakenOut) || 0,
        itemType: 'connector',
        subType,
        department: notificationData?.SenderSector ?? '',
        sender: notificationData.SenderUser,
        notes: completionNote,
      };
    } else {
      console.log('Skipping transaction logging: No connector ID available');
    }

    // Delegate transaction to repository
    return await this.notificationsRepo.finishNotificationTransaction(
      id,
      connectorUpdate,
      transactionDto,
      completionNote,
    );
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
}

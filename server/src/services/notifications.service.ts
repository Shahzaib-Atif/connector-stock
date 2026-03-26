import { Injectable } from '@nestjs/common';
import { NotificationsRepo } from 'src/repository/notifications.repo';
import { ConnectorRepo } from 'src/repository/connectors.repo';
import {
  NotificationWithParsedData,
  NotificationWithSample,
  AppNotification,
} from 'src/dtos/notifications.dto';
import { UpdateSampleDto } from 'src/dtos/samples.dto';
import { CreateTransactionsDto, ParsedMessage } from 'src/utils/types';
import { Connector } from '@domain/entities/Connector';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepo: NotificationsRepo,
    private readonly connectorRepo: ConnectorRepo,
  ) {}

  /** Get all unfinished notifications with parsed data */
  async getUnfinishedNotifications(): Promise<NotificationWithParsedData[]> {
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
  async getNotificationWithSample(
    id: number,
  ): Promise<NotificationWithSample | null> {
    const notification = await this.notificationsRepo.getNotificationById(id);
    if (!notification) {
      return null;
    }

    // Parse message to extract connector and encomenda
    const parsed = this.parseNotificationMessage(notification.Message);

    // Try to find matching sample and connector
    let linkedSample: UpdateSampleDto | null = null;
    let linkedConnector: Connector | null = null;

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
      linkedSample,
      linkedConnector,
    };
  }

  /** Mark notification as finished and optionally update sample quantity */
  async finishNotification(
    id: number,
    quantityTakenOut: number,
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
          newQty: number;
          updatedBy: string;
        }
      | undefined;

    // Calculate new quantity if linked connector exists
    if (notificationData.linkedConnector && quantityTakenOut > 0) {
      const currentQty = notificationData.linkedConnector.quantity?.total;
      const newQty = Math.max(0, currentQty - quantityTakenOut);

      connectorUpdate = {
        codivmac: notificationData.linkedConnector.id,
        newQty: newQty,
        updatedBy: finishedBy || 'system',
      };
    }

    // Prepare transaction if applicable
    let transactionDto: CreateTransactionsDto | undefined;

    // Use extracted connector from message if linked connector doesn't exist
    const connectorId =
      notificationData.linkedConnector?.id ?? notificationData.parsedConector;

    if (connectorId) {
      transactionDto = {
        itemId: connectorId,
        transactionType: 'OUT',
        amount: Number(quantityTakenOut) || 0,
        itemType: 'connector',
        department: notificationData.SenderSector,
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

    const conectorMatch = message.match(/(?:Conector|Connector):\s*(\S+)/i);
    if (conectorMatch) parsed.conector = conectorMatch[1];

    const encomendaMatch = message.match(/(?:Encomenda|Order):\s*(\d+)/i);
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

import { Injectable } from '@nestjs/common';
import {
  NotificationsRepo,
  ParsedMessage,
} from 'src/repository/notifications.repo';
import { SamplesRepo } from 'src/repository/samples.repo';
import { ConnectorRepo } from 'src/repository/connectors.repo';
import {
  NotificationWithParsedData,
  NotificationWithSample,
  AppNotification,
} from 'src/dtos/notifications.dto';
import { UpdateSampleDto } from 'src/dtos/samples.dto';
import { ConnectorDto } from 'src/dtos/connector.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepo: NotificationsRepo,
    private readonly samplesRepo: SamplesRepo,
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
    let linkedSample: UpdateSampleDto = null;
    let linkedConnector: ConnectorDto = null;

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
      linkedSample,
      linkedConnector,
    };
  }

  /** Mark notification as finished and optionally update sample quantity */
  async finishNotification(
    id: number,
    quantityTakenOut: number,
    finishedBy?: string,
  ): Promise<AppNotification> {
    // Get notification with sample
    const notificationData = await this.getNotificationWithSample(id);
    if (!notificationData) {
      throw new Error(`Notification with ID ${id} not found`);
    }

    let sampleUpdate: {
      sampleId: number;
      newQty: string;
      updatedBy: string;
    };

    // Calculate new quantity if linked sample exists
    if (notificationData.linkedSample && quantityTakenOut > 0) {
      const currentQty = parseInt(
        notificationData.linkedSample.Quantidade || '0',
      );
      const newQty = Math.max(0, currentQty - quantityTakenOut);

      sampleUpdate = {
        sampleId: notificationData.linkedSample.ID,
        newQty: newQty.toString(),
        updatedBy: finishedBy || 'system',
      };
    }

    // Delegate transaction to repository
    return await this.notificationsRepo.finishNotificationTransaction(
      id,
      sampleUpdate,
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
   * Encomenda: 251120ProdId= 274886
   */
  parseNotificationMessage(message: string): ParsedMessage {
    const parsed: ParsedMessage = {};

    // Extract Conector - match "Conector: <value>"
    const conectorMatch = message.match(/Conector:\s*([^\s\n]+)/i);
    if (conectorMatch && conectorMatch[1]) {
      parsed.conector = conectorMatch[1].trim();
    }

    // Extract Encomenda - match "Encomenda: <value>" (before "ProdId=" if present)
    const encomendaMatch = message.match(/Encomenda:\s*([^\s\n]+)/i);
    if (encomendaMatch && encomendaMatch[1]) {
      // Remove "ProdId=" part if present
      parsed.encomenda = encomendaMatch[1].replace(/ProdId=.*$/i, '').trim();
    }

    return parsed;
  }
}

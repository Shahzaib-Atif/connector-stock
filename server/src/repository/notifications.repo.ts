import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

export interface ParsedMessage {
  conector?: string;
  encomenda?: string;
}

@Injectable()
export class NotificationsRepo {
  constructor(private prisma: PrismaService) {}

  /** Get all unfinished notifications ordered by creation date */
  async getUnfinishedNotifications() {
    try {
      return await this.prisma.notification_Users.findMany({
        where: { Finished: false },
        orderBy: { CreationDate: 'desc' },
      });
    } catch (ex: any) {
      console.error('Failed to get unfinished notifications:', ex.message);
      return [];
    }
  }

  /** Get notification by ID */
  async getNotificationById(id: number) {
    try {
      return await this.prisma.notification_Users.findUnique({
        where: { id },
      });
    } catch (ex: any) {
      console.error('Failed to get notification:', ex.message);
      return null;
    }
  }


  /** Mark notification as read */
  async markAsRead(id: number) {
    try {
      return await this.prisma.notification_Users.update({
        where: { id },
        data: {
          Read: true,
          ReadDate: new Date(),
        },
      });
    } catch (ex: any) {
      console.error('Failed to mark notification as read:', ex.message);
      return null;
    }
  }

  /** Find matching sample by Amostra and EncDivmac */
  async findMatchingSample(conector: string, encomenda: string) {
    try {
      const samples = await this.prisma.rEG_Amostras.findMany({
        where: {
          Amostra: conector,
          EncDivmac: encomenda,
          IsActive: true,
        },
        select: {
          ID: true,
          Amostra: true,
          EncDivmac: true,
          Cliente: true,
          Projeto: true,
          Quantidade: true,
        },
        take: 1,
        orderBy: { ID: 'desc' },
      });

      return samples.length > 0 ? samples[0] : null;
    } catch (ex: any) {
      console.error('Failed to find matching sample:', ex.message);
      return null;
    }
  }

  /**
   * Mark notification as finished and update sample quantity in a transaction
   */
  async finishNotificationTransaction(
    notificationId: number,
    sampleUpdate?: {
      sampleId: number;
      newQty: string;
      updatedBy: string;
    },
  ) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Mark notification as finished
      const updatedNotification = await tx.notification_Users.update({
        where: { id: notificationId },
        data: {
          Finished: true,
          FinishedDate: new Date(),
        },
      });

      // 2. Update sample quantity if provided
      if (sampleUpdate) {
        await tx.rEG_Amostras.update({
          where: { ID: sampleUpdate.sampleId },
          data: {
            Quantidade: sampleUpdate.newQty,
            LasUpdateBy: sampleUpdate.updatedBy,
            DateOfLastUpdate: new Date().toISOString(),
          },
        });
      }

      return updatedNotification;
    });
  }
}

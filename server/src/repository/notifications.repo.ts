import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AppNotification } from 'src/dtos/notifications.dto';
import { UpdateSampleDto } from 'src/dtos/samples.dto';
import { CreateTransactionsDto } from 'src/dtos/transaction.dto';

export interface ParsedMessage {
  conector?: string;
  encomenda?: string;
}

@Injectable()
export class NotificationsRepo {
  constructor(private prisma: PrismaService) {}

  /** Get all unfinished notifications ordered by creation date */
  async getUnfinishedNotifications(): Promise<AppNotification[]> {
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
  async getNotificationById(id: number): Promise<AppNotification | null> {
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
  async markAsRead(id: number): Promise<AppNotification | null> {
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
  async findMatchingSample(
    conector: string,
    encomenda: string,
  ): Promise<UpdateSampleDto | null> {
    try {
      const samples: UpdateSampleDto[] =
        await this.prisma.rEG_Amostras.findMany({
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
            Ref_Descricao: true,
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
    connectorUpdate?: {
      codivmac: string;
      newQty: number;
      updatedBy: string;
    },
    transactionDto?: CreateTransactionsDto,
    completionNote?: string,
  ): Promise<AppNotification> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Mark notification as finished
      const updatedNotification = await tx.notification_Users.update({
        where: { id: notificationId },
        data: {
          Finished: true,
          FinishedDate: new Date(),
          CompletionNote: completionNote,
        },
      });

      try {
        // 2. Update connector quantity if provided
        if (connectorUpdate) {
          await tx.connectors_Main.update({
            where: { CODIVMAC: connectorUpdate.codivmac },
            data: {
              Qty: connectorUpdate.newQty,
              LastChangeBy: connectorUpdate.updatedBy,
              LastUpdateDate: new Date(),
            },
          });
        }
      } catch (e: any) {
        console.log(e.message);
      }

      // 3. Create transaction record if provided
      if (transactionDto) {
        try {
          await tx.transactions.create({
            data: transactionDto,
          });
        } catch (e: any) {
          console.error('Failed to create transaction record:', e.message);
        }
      }

      return updatedNotification;
    });
  }
}

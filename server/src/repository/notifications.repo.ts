import { TransactionMapper } from '@infra/TransactionMapper';
import { Injectable } from '@nestjs/common';
import { SamplesDto } from '@shared/dto/SamplesDto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTransactionsDto } from '@shared/types/Transaction';
import { AppNotification } from '@shared/types/Notification';
import { NotificationMapper } from '@infra/NotificationMapper';
import { WireTypes } from '@shared/enums/WireTypes';
import { UpdateConnectorDto } from 'src/dtos/connector.dto';

@Injectable()
export class NotificationsRepo {
  constructor(private prisma: PrismaService) {}

  /** Get all unfinished notifications ordered by creation date */
  async getUnfinishedNotifications(): Promise<AppNotification[]> {
    try {
      const data = await this.prisma.notification_Users.findMany({
        where: { Finished: false },
        orderBy: [{ Read: 'asc' }, { id: 'desc' }],
      });

      if (!data) return [];

      return data.map((n) => NotificationMapper.prismaToDto(n));
    } catch (ex: any) {
      console.error('Failed to get unfinished notifications:', ex.message);
      return [];
    }
  }

  /** Get notification by ID */
  async getNotificationById(id: number): Promise<AppNotification | null> {
    try {
      const data = await this.prisma.notification_Users.findUnique({
        where: { id },
      });
      return data ? NotificationMapper.prismaToDto(data) : null;
    } catch (ex: any) {
      console.error('Failed to get notification:', ex.message);
      return null;
    }
  }

  /** Mark notification as read */
  async markAsRead(id: number): Promise<AppNotification | null> {
    try {
      const data = await this.prisma.notification_Users.update({
        where: { id },
        data: {
          Read: true,
          ReadDate: new Date(),
        },
      });

      return data ? NotificationMapper.prismaToDto(data) : null;
    } catch (ex: any) {
      console.error('Failed to mark notification as read:', ex.message);
      return null;
    }
  }

  /** Find matching sample by Amostra and EncDivmac */
  async findMatchingSample(
    conector: string,
    encomenda: string,
  ): Promise<SamplesDto | null> {
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
          Ref_Descricao: true,
        },
        take: 1,
        orderBy: { ID: 'desc' },
      });

      return samples.length > 0 ? (samples[0] as SamplesDto) : null;
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
    connectorUpdate?: UpdateConnectorDto,
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
          const current = await tx.connectors_Main.findUnique({
            where: { CODIVMAC: connectorUpdate.codivmac },
            select: {
              Qty: true,
              Qty_com_fio: true,
              Qty_sem_fio: true,
            },
          });

          if (!current) {
            throw new Error(`Connector not found: ${connectorUpdate.codivmac}`);
          }

          const currentWith = current.Qty_com_fio ?? 0;
          const currentWithout = current.Qty_sem_fio ?? 0;

          const take = Math.max(
            0,
            Number(connectorUpdate.quantityTakenOut) || 0,
          );

          let newWith = currentWith;
          let newWithout = currentWithout;

          if (connectorUpdate.subType === WireTypes.COM_FIO) {
            newWith = Math.max(0, currentWith - take);
          } else if (connectorUpdate.subType === WireTypes.SEM_FIO) {
            newWithout = Math.max(0, currentWithout - take);
          }

          const newTotal = newWith + newWithout;

          await tx.connectors_Main.update({
            where: { CODIVMAC: connectorUpdate.codivmac },
            data: {
              Qty: newTotal,
              Qty_com_fio: newWith,
              Qty_sem_fio: newWithout,
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
            data: TransactionMapper.toPrismaCreate(transactionDto),
          });
        } catch (e: any) {
          console.error('Failed to create transaction record:', e.message);
        }
      }

      return NotificationMapper.prismaToDto(updatedNotification);
    });
  }
}

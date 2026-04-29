import { Injectable } from '@nestjs/common';
import { SamplesDto } from '@shared/dto/SamplesDto';
import { PrismaService } from 'prisma/prisma.service';
import { AppNotification } from '@shared/types/Notification';
import { NotificationMapper } from '@infra/NotificationMapper';
import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';
import { CreateTransactionsDto } from '@shared/types/Transaction';
import { ConnectorRepo } from './connectors.repo';
import { TransactionsRepo } from './transactions.repo';

type ConnectorStockUpdateData = {
  codivmac: string;
  Qty: number;
  Qty_com_fio: number;
  Qty_sem_fio: number;
  updatedBy: string;
};

@Injectable()
export class NotificationsRepo {
  constructor(
    private prisma: PrismaService,
    private connRepo: ConnectorRepo,
    private transactionRepo: TransactionsRepo,
  ) {}

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

  /** Mark notification as finished */
  async finishNotification(
    notificationId: number,
    completionNote?: string,
    tx?: TransactionClient,
  ): Promise<AppNotification> {
    const client = tx || this.prisma;
    const updatedNotification = await client.notification_Users.update({
      where: { id: notificationId },
      data: {
        Finished: true,
        FinishedDate: new Date(),
        CompletionNote: completionNote,
      },
    });

    return NotificationMapper.prismaToDto(updatedNotification);
  }

  async finishNotificationTransaction(
    notificationId: number,
    completionNote?: string,
    connectorStockUpdate?: ConnectorStockUpdateData,
    transactionDto?: CreateTransactionsDto,
  ): Promise<AppNotification> {
    return this.prisma.$transaction(async (tx) => {
      const finishedNotification = await this.finishNotification(
        notificationId,
        completionNote,
        tx,
      );

      if (connectorStockUpdate) {
        await this.connRepo.updateConnectorStock(
          connectorStockUpdate.codivmac,
          connectorStockUpdate.Qty,
          connectorStockUpdate.Qty_com_fio,
          connectorStockUpdate.Qty_sem_fio,
          connectorStockUpdate.updatedBy,
          tx,
        );
      }

      if (transactionDto) {
        await this.transactionRepo.addTransaction(transactionDto, tx);
      }

      return finishedNotification;
    });
  }
}

import { Injectable } from '@nestjs/common';
import { SamplesDto } from '@shared/dto/SamplesDto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTransactionsDto } from '@shared/types/Transaction';
import { AppNotification } from '@shared/types/Notification';
import { NotificationMapper } from '@infra/NotificationMapper';
import { WireTypes } from '@shared/enums/WireTypes';
import { UpdateConnectorDto } from 'src/dtos/connector.dto';
import { ConnectorRepo } from './connectors.repo';
import { TransactionsRepo } from './transactions.repo';
import { getErrorMsg } from '@shared/utils/getErrorMsg';

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
        if (connectorUpdate?.codivmac) {
          const current = await this.connRepo.getConnectorByCodivmac(
            connectorUpdate.codivmac,
            tx,
          );

          if (!current) {
            throw new Error(
              `Connector not found during transaction: ${connectorUpdate.codivmac}`,
            );
          }

          // Calculate new quantities based on subtype
          const currentWithWire = current.Qty_com_fio ?? 0;
          const currentWithoutWire = current.Qty_sem_fio ?? 0;

          // Ensure quantityTakenOut is a valid number
          const take = Math.max(
            0,
            Number(connectorUpdate.quantityTakenOut) || 0,
          );

          // Prevent taking out more than available
          let newWithWire = currentWithWire;
          let newWithoutWire = currentWithoutWire;

          if (connectorUpdate.subType === WireTypes.COM_FIO) {
            newWithWire = Math.max(0, currentWithWire - take);
          } else if (connectorUpdate.subType === WireTypes.SEM_FIO) {
            newWithoutWire = Math.max(0, currentWithoutWire - take);
          }

          const newTotal = newWithWire + newWithoutWire;

          await this.connRepo.updateConnectorStock(
            connectorUpdate.codivmac,
            newTotal,
            newWithWire,
            newWithoutWire,
            connectorUpdate.updatedBy,
            tx,
          );
        }
      } catch (e) {
        console.log(getErrorMsg(e));
      }

      // 3. Create transaction record if provided
      if (transactionDto) {
        await this.transactionRepo.addTransaction(transactionDto, tx);
      }

      return NotificationMapper.prismaToDto(updatedNotification);
    });
  }
}

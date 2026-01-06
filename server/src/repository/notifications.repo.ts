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

  /** Mark notification as finished */
  async markAsFinished(id: number) {
    try {
      return await this.prisma.notification_Users.update({
        where: { id },
        data: {
          Finished: true,
          FinishedDate: new Date(),
        },
      });
    } catch (ex: any) {
      console.error('Failed to mark notification as finished:', ex.message);
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
}

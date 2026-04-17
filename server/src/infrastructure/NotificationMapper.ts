import { AppNotification } from '@shared/types/Notification';
import { Notification_Users } from 'src/generated/prisma/client';

export class NotificationMapper {
  static prismaToDto(data: Notification_Users): AppNotification {
    return {
      ...data,
      CreationDate: data.CreationDate ? data.CreationDate.toISOString() : null,
      ReadDate: data.ReadDate ? data.ReadDate.toISOString() : null,
      FinishedDate: data.FinishedDate ? data.FinishedDate.toISOString() : null,
    };
  }
}

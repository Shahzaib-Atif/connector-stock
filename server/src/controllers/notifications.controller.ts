import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationsService } from 'src/services/notifications.service';
import { FinishNotificationDto } from 'src/dtos/notifications.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** Get all unfinished notifications */
  @Get()
  async getUnfinishedNotifications() {
    return this.notificationsService.getUnfinishedNotifications();
  }

  /** Get notification by ID with linked sample */
  @Get(':id')
  async getNotificationWithSample(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.getNotificationWithSample(id);
  }

  /** Mark notification as finished with quantity update */
  @Patch(':id/finish')
  async finishNotification(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: FinishNotificationDto,
  ) {
    return this.notificationsService.finishNotification(
      id,
      dto.quantityTakenOut,
      dto.finishedBy,
    );
  }

  /** Mark notification as read */
  @Patch(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id);
  }
}

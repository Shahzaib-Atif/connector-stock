import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LegacyService } from './legacy.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from '@shared/enums/UserRoles';
import { UpdateLegacyConnectorTypeDto } from './legacy.dto';

@Controller('api/legacy')
export class LegacyController {
  constructor(private readonly service: LegacyService) {}

  @Get('backups')
  async getBackups() {
    return await this.service.getBackups();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Master, UserRoles.Admin)
  @Post('connectors/:id/type')
  async updateConnectorType(
    @Param('id') id: string,
    @Body() body: UpdateLegacyConnectorTypeDto,
  ) {
    return await this.service.updateConnectorType(id, body);
  }
}

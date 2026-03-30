import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AccessoryRepo } from 'src/repository/accessories.repo';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AccessoriesService } from 'src/services/accessories.service';
import { UserRoles } from '@shared/enums/UserRoles';
import { AccessoryDto } from '@shared/dto/AccessoryDto';

@Controller('api/accessories')
export class AccessoryController {
  constructor(
    private readonly repo: AccessoryRepo,
    private readonly service: AccessoriesService,
  ) {}

  @Get('/types')
  async getAccessoryTypes() {
    return await this.repo.getAccessoryTypes();
  }

  @Get('')
  async getAccessories() {
    return await this.repo.getAccessories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Master, UserRoles.Admin)
  @Post('/:id/update')
  async updateAccessory(@Param('id') id: number, @Body() body: AccessoryDto) {
    return await this.service.updateAccessory(id, body);
  }
}

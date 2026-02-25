import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ConnectorsService } from 'src/services/connectors.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateConnectorDto } from 'src/dtos/connector.dto';
import { UserRoles } from 'src/utils/types';

@Controller('api/connectors')
export class ConnectorController {
  constructor(private readonly service: ConnectorsService) {}

  @Get('/types')
  async getConnectorTypes() {
    return await this.service.getConnectorTypes();
  }

  @Get('')
  async getReferencias() {
    return await this.service.getConnectors();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Post('/:id/update')
  async updateConnector(
    @Param('id') id: string,
    @Body() body: UpdateConnectorDto,
  ) {
    return await this.service.updateConnector(id, body);
  }
}

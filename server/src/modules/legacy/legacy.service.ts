import { Injectable } from '@nestjs/common';
import { LegacyRepo } from './legacy.repo';
import { UpdateLegacyConnectorTypeDto } from './legacy.dto';

@Injectable()
export class LegacyService {
  constructor(private readonly repo: LegacyRepo) {}

  async getBackups() {
    return await this.repo.getBackupData();
  }

  updateConnectorType(codivmac: string, dto: UpdateLegacyConnectorTypeDto) {
    return this.repo.updateConnectorType(
      codivmac,
      dto.connType,
      dto.lastChangeBy,
    );
  }
}

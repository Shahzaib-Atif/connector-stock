import { Injectable } from '@nestjs/common';
import { LegacyRepo } from './legacy.repo';

@Injectable()
export class LegacyService {
  constructor(private readonly repo: LegacyRepo) {}

  async getBackups() {
    return await this.repo.getBackupData();
  }
}

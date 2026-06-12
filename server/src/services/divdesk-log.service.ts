import { Injectable, Logger } from '@nestjs/common';
import { CreateLineStatusLogDto } from '@shared/dto/DivDeskDtos';
import { CreateUpdateConnNameLogDto } from '@shared/dto/DivDeskDtos';
import { mkdir, appendFile } from 'fs/promises';
import { join } from 'path';
import {
  CreateLineStatusLogEntry,
  CreateUpdateConnNameLogEntry,
} from 'src/utils/types';

@Injectable()
export class DivDeskLoggingService {
  private readonly logger = new Logger(DivDeskLoggingService.name);
  private readonly logDir =
    process.env.LINE_STATUS_LOG_DIR || join(process.cwd(), 'logs');

  // Method to create a new line status log entry
  async create(dto: CreateLineStatusLogDto) {
    const entry: CreateLineStatusLogEntry = {
      event: 'setLineStatus',
      datetime: new Date().toLocaleString(),
      ...dto,
    };

    // Only include errMsg if it exists to avoid cluttering
    if (!dto.errMsg) delete entry.errMsg;

    return this.writeEntry('line-status', entry);
  }

  // Method to create a new update connector name log entry
  async createUpdateConnName(dto: CreateUpdateConnNameLogDto) {
    // build the log entry
    const entry: CreateUpdateConnNameLogEntry = {
      event: 'updateConnName',
      datetime: new Date().toLocaleString(),
      ...dto,
    };

    // Only include errMsg if it exists to avoid cluttering
    if (!dto.errMsg) delete entry.errMsg;

    return this.writeEntry('update-conn-name', entry);
  }

  // Helper method to write log entries to a file
  private async writeEntry(
    prefix: 'line-status' | 'update-conn-name',
    entry: CreateLineStatusLogEntry | CreateUpdateConnNameLogEntry,
  ) {
    const logFilePath = join(
      this.logDir,
      `${prefix}-${this.getDateStamp()}.log`,
    );

    try {
      await mkdir(this.logDir, { recursive: true });
      await appendFile(logFilePath, `${JSON.stringify(entry)}\n`, 'utf8');
    } catch (error) {
      this.logger.error(`Failed to write ${prefix} log file`, error);
      throw error;
    }

    return {
      success: true,
      logFilePath,
    };
  }

  private getDateStamp() {
    return new Date().toISOString().split('T')[0];
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { CreateLineStatusLogDto } from '@shared/dto/CreateLineStatusLogDto';
import { CreateUpdateConnNameLogDto } from '@shared/dto/CreateUpdateConnNameLogDto';
import { mkdir, appendFile } from 'fs/promises';
import { join } from 'path';

interface RequestContext {
  ip?: string;
  forwardedFor?: string;
  referer?: string;
}

@Injectable()
export class LineStatusLogsService {
  private readonly logger = new Logger(LineStatusLogsService.name);
  private readonly logDir =
    process.env.LINE_STATUS_LOG_DIR || join(process.cwd(), 'logs');

  // Method to create a new line status log entry
  async create(dto: CreateLineStatusLogDto, context: RequestContext) {
    const entry = {
      event: 'setLineStatus',
      datetime: new Date().toISOString(),
      enc: dto.enc,
      line: dto.line,
      divDeskDb: dto.divDeskDb ?? null,
      userAgent: dto.userAgent ?? null,
      referer: context.referer ?? null,
    };

    return this.writeEntry('line-status', entry);
  }

  // Method to create a new update connector name log entry
  async createUpdateConnName(
    dto: CreateUpdateConnNameLogDto,
    context: RequestContext,
  ) {
    const entry = {
      event: 'updateConnName',
      datetime: new Date().toISOString(),
      enc: dto.enc,
      line: dto.line,
      con: dto.con,
      divDeskDb: dto.divDeskDb ?? null,
      userAgent: dto.userAgent ?? null,
      referer: context.referer ?? null,
    };

    return this.writeEntry('update-conn-name', entry);
  }

  // Helper method to write log entries to a file
  private async writeEntry(prefix: string, entry: Record<string, unknown>) {
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

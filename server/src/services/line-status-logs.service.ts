import { Injectable, Logger } from '@nestjs/common';
import { CreateLineStatusLogDto } from '@shared/dto/CreateLineStatusLogDto';
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
  private readonly logFilePath = join(this.logDir, 'line-status.log');

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

    // Attempt to write the log entry to a file, ensuring the directory exists
    try {
      await mkdir(this.logDir, { recursive: true });
      await appendFile(this.logFilePath, `${JSON.stringify(entry)}\n`, 'utf8');
    } catch (error) {
      this.logger.error('Failed to write line status log file', error);
      throw error;
    }

    return {
      success: true,
      logFilePath: this.logFilePath,
    };
  }
}

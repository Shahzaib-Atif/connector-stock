import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { mkdir, appendFile } from 'fs/promises';
import { join } from 'path';

interface MemoryTelemetryEntry {
  datetime: string;
  event: string;
  scope: string;
  rssMB: number;
  heapUsedMB: number;
  heapTotalMB: number;
  externalMB: number;
  arrayBuffersMB: number;
  activeHandles?: number;
  activeRequests?: number;
  details?: Record<string, unknown>;
}

const BYTES_IN_MB = 1024 * 1024;

@Injectable()
export class MemoryTelemetryService {
  private readonly logger = new Logger(MemoryTelemetryService.name);
  private readonly logDir =
    process.env.MEMORY_LOG_DIR || join(process.cwd(), 'logs');
  private imageRequestCounter = 0;

  @Cron('0 */15 * * * *')
  async logHeartbeatSnapshot() {
    await this.capture('heartbeat', 'periodic');
  }

  async capture(
    scope: string,
    event: string,
    details?: Record<string, unknown>,
  ) {
    const usage = process.memoryUsage();
    const processWithInternals = process as NodeJS.Process & {
      _getActiveHandles?: () => unknown[];
      _getActiveRequests?: () => unknown[];
    };

    const entry: MemoryTelemetryEntry = {
      datetime: new Date().toISOString(),
      event,
      scope,
      rssMB: toMB(usage.rss),
      heapUsedMB: toMB(usage.heapUsed),
      heapTotalMB: toMB(usage.heapTotal),
      externalMB: toMB(usage.external),
      arrayBuffersMB: toMB(usage.arrayBuffers),
      activeHandles: processWithInternals._getActiveHandles?.().length,
      activeRequests: processWithInternals._getActiveRequests?.().length,
      details,
    };

    await this.writeEntry(entry);
    return entry;
  }

  shouldSampleImageRequest() {
    this.imageRequestCounter += 1;
    return this.imageRequestCounter % 50 === 0;
  }

  private async writeEntry(entry: MemoryTelemetryEntry) {
    const logFilePath = join(
      this.logDir,
      `memory-telemetry-${this.getDateStamp()}.log`,
    );

    try {
      await mkdir(this.logDir, { recursive: true });
      await appendFile(logFilePath, `${JSON.stringify(entry)}\n`, 'utf8');
    } catch (error) {
      this.logger.error('Failed to write memory telemetry log file', error);
    }
  }

  private getDateStamp() {
    return new Date().toISOString().split('T')[0];
  }
}

function toMB(value: number) {
  return Math.round((value / BYTES_IN_MB) * 100) / 100;
}

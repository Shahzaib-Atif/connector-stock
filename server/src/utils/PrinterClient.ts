import { Logger } from '@nestjs/common';
import * as path from 'path';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';

// OS + printer communication
export class PrinterClient {
  private readonly logger = new Logger(PrinterClient.name);
  private readonly rawPrinterExe = this.getPrinterExePath();

  async printRaw(tsplCommands: string, printer: string) {
    if (!printer) throw new Error('Printer not configured');

    // Write to temp file
    const tempFile = path.join(os.tmpdir(), `label_${Date.now()}.prn`);
    fs.writeFileSync(tempFile, tsplCommands, { encoding: 'ascii' });

    try {
      // Send to printer
      await this.sendToPrinter(tempFile, printer);
    } finally {
      await this.cleanupFile(tempFile);
    }
  }

  private getPrinterExePath() {
    const rawPrinterPath = process.env.RAW_PRINTER_EXE as string;
    const resolvedPath = path.resolve(process.cwd(), rawPrinterPath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`RawPrinter.exe not found at ${resolvedPath}`);
    }

    return resolvedPath;
  }

  private async sendToPrinter(
    filePath: string,
    printerName: string,
  ): Promise<void> {
    this.logger.log(
      `Executing: "${this.rawPrinterExe}" "${printerName}" "${filePath}"`,
    );

    const { stdout, stderr } = await this.runPrinterProcess(
      printerName,
      filePath,
    );

    if (stdout) this.logger.log(stdout);
    if (stderr) this.logger.warn(stderr);

    if (!stdout.includes('SUCCESS')) {
      throw new Error(stdout || stderr || 'Print failed');
    }
  }

  private async runPrinterProcess(
    printerName: string,
    filePath: string,
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn(this.rawPrinterExe, [printerName, filePath], {
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.setEncoding('utf8');
      child.stderr?.setEncoding('utf8');

      child.stdout?.on('data', (chunk: string) => {
        stdout = appendCappedOutput(stdout, chunk);
      });

      child.stderr?.on('data', (chunk: string) => {
        stderr = appendCappedOutput(stderr, chunk);
      });

      child.once('error', reject);

      const timeout = setTimeout(() => {
        child.kill();
        reject(new Error('Printer process timed out'));
      }, 30000);
      timeout.unref();

      child.once('close', (code) => {
        clearTimeout(timeout);

        if (code !== 0 && !stdout.includes('SUCCESS')) {
          reject(
            new Error(
              stderr || stdout || `Printer process exited with code ${code}`,
            ),
          );
          return;
        }

        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
        });
      });
    });
  }

  private async cleanupFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

function appendCappedOutput(current: string, chunk: string) {
  const next = current + chunk;
  const maxLength = 8192;
  return next.length > maxLength ? next.slice(-maxLength) : next;
}

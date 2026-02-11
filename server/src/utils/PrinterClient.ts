import { Logger } from '@nestjs/common';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as os from 'os';

const execAsync = promisify(exec);

export class PrinterClient {
  private readonly logger = new Logger(PrinterClient.name);
  private readonly rawPrinterExe = path.join(
    __dirname,
    '../../../scripts/RawPrinter.exe',
  );

  async printRaw(tsplCommands: string, printer: string) {
    if (!printer) throw new Error('Printer not configured');

    // Check if RawPrinter.exe exists
    if (!fs.existsSync(this.rawPrinterExe)) {
      throw new Error(
        `RawPrinter.exe not found at ${this.rawPrinterExe}. Run build.bat in scripts folder.`,
      );
    }

    // Write to temp file
    const tempFile = path.join(os.tmpdir(), `label_${Date.now()}.prn`);
    fs.writeFileSync(tempFile, tsplCommands, { encoding: 'ascii' });

    // Send to printer
    await this.sendToPrinter(tempFile, printer);

    // Cleanup
    this.cleanupFile(tempFile);
  }

  private async sendToPrinter(
    filePath: string,
    printerName: string,
  ): Promise<void> {
    const command = `"${this.rawPrinterExe}" "${printerName}" "${filePath}"`;
    this.logger.log(`Executing: ${command}`);

    const { stdout, stderr } = await execAsync(command, { timeout: 30000 });

    if (stdout) this.logger.log(stdout.trim());
    if (stderr) this.logger.warn(stderr.trim());

    if (!stdout.includes('SUCCESS')) {
      throw new Error(stdout || stderr || 'Print failed');
    }
  }

  private cleanupFile(filePath: string): void {
    setTimeout(() => {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Ignore cleanup errors
      }
    }, 5000);
  }
}

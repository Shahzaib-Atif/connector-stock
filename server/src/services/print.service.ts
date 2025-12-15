import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

export interface PrintLabelDto {
  itemId: string;
  itemUrl: string;
}

@Injectable()
export class PrintService {
  private readonly logger = new Logger(PrintService.name);
  private readonly printerName = 'TSC TE200';

  // Label dimensions: 45x28mm
  // TSC TE200 resolution: 203 DPI (8 dots/mm)
  // Width: 45mm * 8 = 360 dots
  // Height: 28mm * 8 = 224 dots
  private readonly labelWidthMm = 45;
  private readonly labelHeightMm = 28;

  async printLabel(
    dto: PrintLabelDto,
  ): Promise<{ success: boolean; message: string }> {
    const { itemId, itemUrl } = dto;

    try {
      // Generate TSPL commands for the label
      const tsplCommands = this.generateTsplCommands(itemId, itemUrl);

      // Write TSPL commands to a temporary file
      const tempDir = os.tmpdir();
      const tempFile = path.join(tempDir, `label_${Date.now()}.prn`);

      // Write as binary/raw to preserve exact command format
      fs.writeFileSync(tempFile, tsplCommands, { encoding: 'ascii' });
      this.logger.log(`TSPL file created: ${tempFile}`);
      this.logger.log(`TSPL commands:\n${tsplCommands}`);

      // Send to printer using Windows print command
      await this.sendToPrinter(tempFile);

      // Cleanup temp file after a delay
      setTimeout(() => {
        try {
          fs.unlinkSync(tempFile);
        } catch {
          this.logger.warn(`Could not delete temp file: ${tempFile}`);
        }
      }, 5000);

      return { success: true, message: `Label printed for ${itemId}` };
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Print failed: ${errorMessage}`);
      return { success: false, message: errorMessage };
    }
  }

  private generateTsplCommands(itemId: string, itemUrl: string): string {
    // TSPL2 commands for TSC TE200
    // Reference: TSC TSPL2 Programming Manual

    const commands = [
      // Set label size (45mm x 28mm)
      `SIZE ${this.labelWidthMm} mm, ${this.labelHeightMm} mm`,
      // Gap between labels (2mm gap, 0mm offset)
      'GAP 2 mm, 0',
      // Clear image buffer
      'CLS',
      // Set print direction and mirror
      'DIRECTION 1,0',

      // QR Code: positioned at left side of label
      // Parameters: x, y, ECC level, cell width, mode, rotation, model, mask, "data"
      // x=20, y=20 (dots from origin)
      // ECC=L (low), cell width=4 dots, Auto mode, 0 degree rotation
      `QRCODE 20,30,L,4,A,0,M2,S7,"${itemUrl}"`,

      // Text: Item ID positioned to the right of QR code
      // Parameters: x, y, font, rotation, x-mul, y-mul, "content"
      // x=180 (after QR code), y=70 (centered vertically)
      // font "3" = 12x20 dots, rotation 0, x-mul 1, y-mul 2
      `TEXT 180,50,"3",0,1,2,"${itemId}"`,

      // Additional label info (smaller text below ID)
      `TEXT 180,120,"2",0,1,1,"divmac stock"`,

      // Print 1 label, 1 copy
      'PRINT 1,1',
    ];

    return commands.join('\r\n') + '\r\n';
  }

  private async sendToPrinter(filePath: string): Promise<void> {
    // Create a PowerShell script for raw printing
    const psScriptPath = filePath.replace('.prn', '.ps1');
    
    const psScript = `
# Raw Printer Helper for TSC TE200
$printerName = "${this.printerName}"
$filePath = "${filePath.replace(/\\/g, '\\\\')}"

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public class RawPrinter {
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct DOCINFOW {
        [MarshalAs(UnmanagedType.LPWStr)] public string pDocName;
        [MarshalAs(UnmanagedType.LPWStr)] public string pOutputFile;
        [MarshalAs(UnmanagedType.LPWStr)] public string pDataType;
    }

    [DllImport("winspool.drv", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool OpenPrinter(string pPrinterName, out IntPtr phPrinter, IntPtr pDefault);

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool ClosePrinter(IntPtr hPrinter);

    [DllImport("winspool.drv", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool StartDocPrinter(IntPtr hPrinter, int Level, ref DOCINFOW pDocInfo);

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool EndDocPrinter(IntPtr hPrinter);

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool StartPagePrinter(IntPtr hPrinter);

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool EndPagePrinter(IntPtr hPrinter);

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool WritePrinter(IntPtr hPrinter, IntPtr pBytes, int dwCount, out int dwWritten);

    public static bool SendRawToPrinter(string printerName, byte[] data) {
        IntPtr hPrinter = IntPtr.Zero;
        IntPtr pBytes = IntPtr.Zero;
        bool success = false;
        
        try {
            if (!OpenPrinter(printerName, out hPrinter, IntPtr.Zero)) {
                Console.WriteLine("ERROR: Failed to open printer. Error: " + Marshal.GetLastWin32Error());
                return false;
            }

            DOCINFOW di = new DOCINFOW();
            di.pDocName = "TSC Label";
            di.pDataType = "RAW";

            if (!StartDocPrinter(hPrinter, 1, ref di)) {
                Console.WriteLine("ERROR: StartDocPrinter failed. Error: " + Marshal.GetLastWin32Error());
                return false;
            }

            if (!StartPagePrinter(hPrinter)) {
                Console.WriteLine("ERROR: StartPagePrinter failed. Error: " + Marshal.GetLastWin32Error());
                EndDocPrinter(hPrinter);
                return false;
            }

            pBytes = Marshal.AllocHGlobal(data.Length);
            Marshal.Copy(data, 0, pBytes, data.Length);
            
            int written = 0;
            success = WritePrinter(hPrinter, pBytes, data.Length, out written);
            
            if (!success) {
                Console.WriteLine("ERROR: WritePrinter failed. Error: " + Marshal.GetLastWin32Error());
            } else {
                Console.WriteLine("SUCCESS: Wrote " + written + " bytes to printer");
            }

            EndPagePrinter(hPrinter);
            EndDocPrinter(hPrinter);
        }
        finally {
            if (pBytes != IntPtr.Zero) Marshal.FreeHGlobal(pBytes);
            if (hPrinter != IntPtr.Zero) ClosePrinter(hPrinter);
        }
        
        return success;
    }
}
"@

$content = [System.IO.File]::ReadAllBytes($filePath)
Write-Host "Read $($content.Length) bytes from file"
Write-Host "Sending to printer: $printerName"

$result = [RawPrinter]::SendRawToPrinter($printerName, $content)

if ($result) {
    Write-Host "PRINT_SUCCESS"
    exit 0
} else {
    Write-Host "PRINT_FAILED"
    exit 1
}
`;

    try {
      // Write PowerShell script to file
      fs.writeFileSync(psScriptPath, psScript, { encoding: 'utf8' });
      this.logger.log(`PowerShell script created: ${psScriptPath}`);

      // Execute the PowerShell script
      const command = `powershell -ExecutionPolicy Bypass -File "${psScriptPath}"`;
      this.logger.log('Executing PowerShell raw printer script...');
      
      const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
      this.logger.log(`PowerShell output: ${stdout}`);
      if (stderr) this.logger.warn(`PowerShell stderr: ${stderr}`);

      // Cleanup script file
      try {
        fs.unlinkSync(psScriptPath);
      } catch {
        // Ignore cleanup errors
      }

      if (stdout.includes('PRINT_SUCCESS')) {
        this.logger.log('Raw print succeeded!');
        return;
      } else {
        throw new Error(`Print failed: ${stdout}`);
      }
    } catch (error: any) {
      this.logger.error(`PowerShell print failed: ${error.message}`);
      
      // Cleanup on error
      try {
        fs.unlinkSync(psScriptPath);
      } catch {
        // Ignore
      }

      throw new Error(
        `Print failed: ${error.message}. Make sure the printer is connected and try running as Administrator.`,
      );
    }
  }
}


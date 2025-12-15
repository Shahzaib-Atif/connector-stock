using System;
using System.IO;
using System.Runtime.InteropServices;

/// <summary>
/// Raw Printer Utility for TSC TE200 (and other thermal printers)
/// Sends raw data (TSPL/ZPL commands) directly to the printer via Windows Spooler API.
/// 
/// Usage: RawPrinter.exe "PrinterName" "FilePath"
/// Example: RawPrinter.exe "TSC TE200" "D:\Temp\label.prn"
/// 
/// Exit codes:
///   0 = Success
///   1 = Invalid arguments
///   2 = File not found
///   3 = Failed to open printer
///   4 = Failed to start document
///   5 = Failed to write to printer
/// </summary>
class RawPrinter
{
    #region Windows Spooler API (winspool.drv)

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct DOCINFOW
    {
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

    #endregion

    static int Main(string[] args)
    {
        if (args.Length < 2)
        {
            Console.Error.WriteLine("Usage: RawPrinter.exe \"PrinterName\" \"FilePath\"");
            return 1;
        }

        string printerName = args[0];
        string filePath = args[1];

        if (!File.Exists(filePath))
        {
            Console.Error.WriteLine("ERROR: File not found: " + filePath);
            return 2;
        }

        byte[] data = File.ReadAllBytes(filePath);
        Console.WriteLine("Read " + data.Length + " bytes from " + filePath);

        return SendRawToPrinter(printerName, data) ? 0 : 5;
    }

    static bool SendRawToPrinter(string printerName, byte[] data)
    {
        IntPtr hPrinter = IntPtr.Zero;
        IntPtr pBytes = IntPtr.Zero;

        try
        {
            // Open printer
            if (!OpenPrinter(printerName, out hPrinter, IntPtr.Zero))
            {
                Console.Error.WriteLine("ERROR: Failed to open printer '" + printerName + "'. Error: " + Marshal.GetLastWin32Error());
                return false;
            }
            Console.WriteLine("Opened printer: " + printerName);

            // Start document with RAW data type
            DOCINFOW di = new DOCINFOW();
            di.pDocName = "TSC Label";
            di.pDataType = "RAW";

            if (!StartDocPrinter(hPrinter, 1, ref di))
            {
                Console.Error.WriteLine("ERROR: StartDocPrinter failed. Error: " + Marshal.GetLastWin32Error());
                return false;
            }

            if (!StartPagePrinter(hPrinter))
            {
                Console.Error.WriteLine("ERROR: StartPagePrinter failed. Error: " + Marshal.GetLastWin32Error());
                EndDocPrinter(hPrinter);
                return false;
            }

            // Write raw data
            pBytes = Marshal.AllocHGlobal(data.Length);
            Marshal.Copy(data, 0, pBytes, data.Length);

            int written = 0;
            bool success = WritePrinter(hPrinter, pBytes, data.Length, out written);

            EndPagePrinter(hPrinter);
            EndDocPrinter(hPrinter);

            if (success)
            {
                Console.WriteLine("SUCCESS: Wrote " + written + " bytes to printer");
                return true;
            }
            else
            {
                Console.Error.WriteLine("ERROR: WritePrinter failed. Error: " + Marshal.GetLastWin32Error());
                return false;
            }
        }
        finally
        {
            if (pBytes != IntPtr.Zero) Marshal.FreeHGlobal(pBytes);
            if (hPrinter != IntPtr.Zero) ClosePrinter(hPrinter);
        }
    }
}


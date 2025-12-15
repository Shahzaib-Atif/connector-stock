@echo off
REM Build script for RawPrinter.exe
REM Requires .NET Framework (csc.exe) or .NET SDK

echo Building RawPrinter.exe...

REM Try .NET Framework compiler first (usually available on Windows)
where csc >nul 2>&1
if %errorlevel% equ 0 (
    csc /out:RawPrinter.exe /target:exe /optimize RawPrinter.cs
    goto :done
)

REM Try finding csc in .NET Framework directory
set CSC_PATH=C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe
if exist "%CSC_PATH%" (
    "%CSC_PATH%" /out:RawPrinter.exe /target:exe /optimize RawPrinter.cs
    goto :done
)

REM Try 32-bit framework
set CSC_PATH=C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe
if exist "%CSC_PATH%" (
    "%CSC_PATH%" /out:RawPrinter.exe /target:exe /optimize RawPrinter.cs
    goto :done
)

echo ERROR: C# compiler (csc.exe) not found!
echo Please install .NET Framework SDK or .NET SDK
exit /b 1

:done
if exist RawPrinter.exe (
    echo SUCCESS: RawPrinter.exe built successfully!
    exit /b 0
) else (
    echo ERROR: Build failed!
    exit /b 1
)

# Connector-Stock — Server

This folder contains the NestJS server for the Connector-Stock project. The application is built with NestJS and uses Prisma in a DB-first (introspect) workflow: the canonical schema is the production database and this repository only pulls (introspects) the schema — it must never push schema changes to the DB.

## Project setup

Install dependencies:

```bash
npm install
```

Create a `.env` (development) or `.env.prod` (production) file at the project root with your environment variables.

```env
PORT=4000
DATABASE_URL="sqlserver://host;database=dbname;user=user;password=pass;encrypt=true;trustServerCertificate=true"
JWT_SECRET="add secret here"
```

Prisma schema is located at `prisma/schema.prisma` and is owned by the database. Do not manually edit it unless you know what you are doing.

## Frontend Static Hosting

The NestJS server is configured to serve the built frontend application as static files. 
- The server looks for the production build in `../../client/dist`.
- Any request that does not start with `/api` will be redirected to the frontend's `index.html`, supporting Single Page Application (SPA) routing.
- This allows a unified deployment where the backend handles both the API and the UI.

## Deployment with PM2

The application is configured for process management using **PM2** and the `ecosystem.config.js` file.

### Commands

- **Start with PM2**:
  ```bash
  pm2 start ecosystem.config.js
  ```

- **Restart**:
  ```bash
  pm2 restart csm-app
  ```

- **Logs**:
  ```bash
  pm2 logs csm-app
  ```

- **Monitor**:
  ```bash
  pm2 monit
  ```

### Ecosystem Configuration (`ecosystem.config.js`)
The configuration enables **Cluster Mode** with 2 instances by default and sets the `NODE_ENV` to `prod`, which triggers the server to load `.env.prod`.

## Run the server

- Development (watch mode):

```bash
npm run start:dev
```

- Production (Manual build & run):

```bash
npm run build
npm run start:prod
```

## Where to look in this repo

- API controllers: `src/controllers`
- Services: `src/services`
- Repositories: `src/repository`
- Prisma schema: `prisma/schema.prisma`
- Print service: `src/services/print.service.ts`

## Label Printing

The application supports printing QR code labels using a **TSC TE200** printer.

### Key Features
- **QR Code Generation**: Automatically generates QR codes for samples, boxes, and connectors.
- **Custom Dimensions**: Standard label size is **45x28mm** (with a 2mm gap).
- **TSPL Commands**: Uses the TSPL language to communicate directly with the printer.

### Technical Implementation
- **PrintService**: Handles the generation of TSPL commands and manages the printing workflow.
- **RawPrinter Utility**: A custom C# utility located in `scripts/RawPrinter.exe` is used to send raw commands to the Windows print spooler.
- **Workflow**:
  1. Generate TSPL commands as a `.prn` file.
  2. Call `RawPrinter.exe` with the printer name and file path.
  3. Clean up the temporary file.

### Building the RawPrinter Utility
If `scripts/RawPrinter.exe` is missing or needs updates, you can rebuild it using the provided batch script:
```bash
cd server/scripts
./build.bat
```
> [!NOTE]
> This requires the C# compiler (`csc.exe`) to be available in your system path.

## Resources

- NestJS docs: https://docs.nestjs.com
- Prisma introspection docs: https://www.prisma.io/docs/concepts/components/introspection
- PM2 Documentation: https://pm2.keymetrics.io/docs/usage/quick-start/

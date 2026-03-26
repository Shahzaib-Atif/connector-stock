import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: envPath });

async function bootstrap() {
  // const httpsOptions = getHttpsOptions();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // httpsOptions,
  });

  // add static files serving
  serveStaticFiles(app);

  // add logger and api documentation
  addLogger(app);
  addApiDocumentation(app);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log('-- Server listening on port', process.env.PORT);
  if (process.send) {
    process.send('ready');
  }
}

bootstrap()
  .then(() => {})
  .catch((e: any) => {
    Logger.error('Error: ', e.message);
  });

// Setup Swagger API documentation
function addApiDocumentation(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The connector-stock api description')
    .setVersion('1.0')
    .addTag('connector-stock')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
}

// Simple request logger middleware
function addLogger(app: INestApplication) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    Logger.log(`${req.method} ${req.url}`);
    next();
  });
}

// Serve static files from the client/dist folder
function serveStaticFiles(app: NestExpressApplication) {
  app.useStaticAssets(
    join(__dirname, '..', '..', '..', '..', 'client', 'dist'),
  );

  // spa fallback
  const server = app.getHttpAdapter().getInstance();
  server.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(
      join(__dirname, '..', '..', '..', '..', 'client', 'dist', 'index.html'),
    );
  });
}

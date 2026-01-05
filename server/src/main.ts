import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // add frontend static files serving
  app.useStaticAssets(join(__dirname, '..', '..', '..', 'client', 'dist'));

  // spa fallback
  const server = app.getHttpAdapter().getInstance();
  server.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(
      join(__dirname, '..', '..', '..', 'client', 'dist', 'index.html'),
    );
  });

  // add logger and api documentation
  addLogger(app);
  addApiDocumentation(app);

  await app.listen(process.env.PORT ?? 3000);
  console.log('-- Server listening on port', process.env.PORT);
}

bootstrap()
  .then(() => {})
  .catch((e: any) => {
    console.error('Something went wrong!', e.message);
  });

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

function addLogger(app: INestApplication) {
  app.use((req, res, next) => {
    Logger.log(`${req.method} ${req.url}`);
    next();
  });
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  addApiDocumentation(app);
  addLogger(app);

  await app.listen(process.env.PORT ?? 3000);
  console.log('-- Server listening on port', process.env.PORT);
}

bootstrap()
  .then(() => {})
  .catch(() => {
    console.error('Something went wrong!');
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

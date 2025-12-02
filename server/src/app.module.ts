import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from 'src/services/app.service';
import { AppController } from 'src/controllers/app.controller';
import { DBService } from 'src/services/db.service';
import { PrismaService } from 'prisma/prisma.service';
import { ImageController } from './controllers/image.controller';
import { ImageService } from './services/image.service';
import { MetadataController } from './controllers/metadata.controller';
import { AccessoryController } from './controllers/accessories.controller';
import { ConnectorController } from './controllers/connectors.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    AppController,
    ImageController,
    MetadataController,
    AccessoryController,
    ConnectorController,
  ],
  providers: [AppService, DBService, PrismaService, ImageService],
})
export class AppModule {}

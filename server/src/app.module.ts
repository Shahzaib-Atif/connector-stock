import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from 'src/services/app.service';
import { AppController } from 'src/controllers/app.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ImageController } from './controllers/image.controller';
import { ImageService } from './services/image.service';
import { MetadataController } from './controllers/metadata.controller';
import { AccessoryController } from './controllers/accessories.controller';
import { ConnectorController } from './controllers/connectors.controller';
import { MetadataRepo } from './repository/metadata.repo';
import { AccessoryRepo } from './repository/accessories.repo';
import { ConnectorRepo } from './repository/connectors.repo';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    AppController,
    ImageController,
    MetadataController,
    AccessoryController,
    ConnectorController,
  ],
  providers: [
    AppService,
    PrismaService,
    ImageService,
    MetadataRepo,
    AccessoryRepo,
    ConnectorRepo,
  ],
})
export class AppModule {}

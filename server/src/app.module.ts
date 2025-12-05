import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { ImageController } from './controllers/image.controller';
import { ImageService } from './services/image.service';
import { MetadataController } from './controllers/metadata.controller';
import { AccessoryController } from './controllers/accessories.controller';
import { ConnectorController } from './controllers/connectors.controller';
import { MetadataRepo } from './repository/metadata.repo';
import { AccessoryRepo } from './repository/accessories.repo';
import { ConnectorRepo } from './repository/connectors.repo';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { TransactionsRepo } from './repository/transactions.repo';
import { SamplesController } from './controllers/samples.controller';
import { SamplesRepo } from './repository/samples.repo';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    ImageController,
    MetadataController,
    AccessoryController,
    ConnectorController,
    TransactionsController,
    SamplesController,
  ],
  providers: [
    PrismaService,
    ImageService,
    MetadataRepo,
    AccessoryRepo,
    ConnectorRepo,
    TransactionsService,
    TransactionsRepo,
    SamplesRepo,
  ],
})
export class AppModule {}

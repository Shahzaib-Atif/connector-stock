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
import { SamplesService } from './services/samples.service';
import { ConnectorsService } from './services/connectors.service';
import { PrintController } from './controllers/print.controller';
import { PrintService } from './services/print.service';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [
    ImageController,
    MetadataController,
    AccessoryController,
    ConnectorController,
    TransactionsController,
    SamplesController,
    PrintController,
  ],
  providers: [
    PrismaService,
    ImageService,
    MetadataRepo,
    AccessoryRepo,
    ConnectorRepo,
    ConnectorsService,
    TransactionsService,
    TransactionsRepo,
    SamplesRepo,
    SamplesService,
    PrintService,
  ],
})
export class AppModule {}

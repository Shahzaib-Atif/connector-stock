import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './services/app.service';
import { AppController } from './controllers/app.controller';
import { DBService } from './services/db.service';
import { DBController } from './controllers/db.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, DBController],
  providers: [AppService, DBService, PrismaService],
})
export class AppModule {}

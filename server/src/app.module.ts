import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from 'src/services/app.service';
import { AppController } from 'src/controllers/app.controller';
import { DBService } from 'src/services/db.service';
import { DBController } from 'src/controllers/db.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, DBController],
  providers: [AppService, DBService, PrismaService],
})
export class AppModule {}

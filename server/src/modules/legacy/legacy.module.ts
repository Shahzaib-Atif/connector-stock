import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LegacyController } from './legacy.controller';
import { LegacyService } from './legacy.service';
import { LegacyRepo } from './legacy.repo';

@Module({
  controllers: [LegacyController],
  providers: [PrismaService, LegacyService, LegacyRepo],
})
export class LegacyModule {}

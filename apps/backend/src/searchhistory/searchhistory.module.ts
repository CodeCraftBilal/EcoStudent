import { Module } from '@nestjs/common';
import { SearchhistoryService } from './searchhistory.service';
import { SearchhistoryController } from './searchhistory.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SearchhistoryController],
  providers: [SearchhistoryService, PrismaService],
})
export class SearchhistoryModule {}

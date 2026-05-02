import { Module } from '@nestjs/common';
import { SearchhistoryService } from './searchhistory.service';
import { SearchhistoryController } from './searchhistory.controller';

@Module({
  controllers: [SearchhistoryController],
  providers: [SearchhistoryService],
})
export class SearchhistoryModule {}

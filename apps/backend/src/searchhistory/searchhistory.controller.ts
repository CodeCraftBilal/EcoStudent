import { Controller, Get, Post, Body, Param, Delete, Req, Query, BadRequestException } from '@nestjs/common';
import { SearchhistoryService } from './searchhistory.service';
import { CreateSearchhistoryDto } from './dto/create-searchhistory.dto';

@Controller('search-history')
export class SearchhistoryController {
  constructor(private readonly searchhistoryService: SearchhistoryService) {}

  @Post()
  create(@Req() req, @Body() createSearchhistoryDto: CreateSearchhistoryDto) {
    return this.searchhistoryService.createOrUpdateSearch(
      +req.user.id,
      createSearchhistoryDto.query,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.searchhistoryService.getUserSearchHistory(+req.user.id);
  }

  @Get('search')
  search(@Req() req, @Query('q') q: string) {
    if (!q || q.trim() === '') {
      throw new BadRequestException('Query parameter "q" must not be empty');
    }
    return this.searchhistoryService.searchHistory(+req.user.id, q.trim());
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.searchhistoryService.deleteSearchHistoryItem(+req.user.id, +id);
  }

  @Delete()
  clearAll(@Req() req) {
    return this.searchhistoryService.clearSearchHistory(+req.user.id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SearchhistoryService } from './searchhistory.service';
import { CreateSearchhistoryDto } from './dto/create-searchhistory.dto';
import { UpdateSearchhistoryDto } from './dto/update-searchhistory.dto';

@Controller('searchhistory')
export class SearchhistoryController {
  constructor(private readonly searchhistoryService: SearchhistoryService) {}

  @Post()
  create(@Body() createSearchhistoryDto: CreateSearchhistoryDto) {
    return this.searchhistoryService.create(createSearchhistoryDto);
  }

  @Get()
  findAll() {
    return this.searchhistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.searchhistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSearchhistoryDto: UpdateSearchhistoryDto) {
    return this.searchhistoryService.update(+id, updateSearchhistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.searchhistoryService.remove(+id);
  }
}

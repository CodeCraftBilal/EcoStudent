import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Req() req) {
    console.log('req rec on create')
    return this.favoriteService.create(req.user.id, createFavoriteDto);
  }

  @Get('user')
  findByUserId(@Req() req, @Query() query: any) {
    return this.favoriteService.findFavoritesByUserId(req.user.id, query);
  }

  @Get('ids')
  favoriteIds(@Req() req) {
    return this.favoriteService.favoriteIds(req.user.id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoriteService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.favoriteService.remove(+id, req.user.id);
  }
}

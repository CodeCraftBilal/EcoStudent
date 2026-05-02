import { Injectable } from '@nestjs/common';
import { CreateSearchhistoryDto } from './dto/create-searchhistory.dto';
import { UpdateSearchhistoryDto } from './dto/update-searchhistory.dto';

@Injectable()
export class SearchhistoryService {
  create(createSearchhistoryDto: CreateSearchhistoryDto) {
    return 'This action adds a new searchhistory';
  }

  findAll() {
    return `This action returns all searchhistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} searchhistory`;
  }

  update(id: number, updateSearchhistoryDto: UpdateSearchhistoryDto) {
    return `This action updates a #${id} searchhistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} searchhistory`;
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { SearchhistoryController } from './searchhistory.controller';
import { SearchhistoryService } from './searchhistory.service';

describe('SearchhistoryController', () => {
  let controller: SearchhistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchhistoryController],
      providers: [SearchhistoryService],
    }).compile();

    controller = module.get<SearchhistoryController>(SearchhistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

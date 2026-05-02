import { Test, TestingModule } from '@nestjs/testing';
import { SearchhistoryService } from './searchhistory.service';

describe('SearchhistoryService', () => {
  let service: SearchhistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchhistoryService],
    }).compile();

    service = module.get<SearchhistoryService>(SearchhistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

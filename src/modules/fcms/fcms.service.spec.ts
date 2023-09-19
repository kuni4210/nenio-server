import { Test, TestingModule } from '@nestjs/testing';
import { FcmsService } from './fcms.service';

describe('FcmsService', () => {
  let service: FcmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FcmsService],
    }).compile();

    service = module.get<FcmsService>(FcmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

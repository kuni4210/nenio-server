import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

describe('QuestionsController', () => {
  let controller: QuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionsService],
      controllers: [QuestionsController],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
  });

  // describe('getQuetionList', () => {
  //   it('getQuestionList() 의 실행 결과 테스트', () => {
  //     const mockFunction = jest.fn()
  //     mockFunction.mockReturnT
  //     const mockResponse: Partial<Response> = {
  //       status: jest.fn().mockReturnThis(),
  //       send: jest.fn()
  //     };
  //     controller.getQuestionList({page: '1'}, mockResponse as Response);
  //     expect(mockResponse.status).toHaveBeenCalledWith(200);
  //     expect(mockResponse.send).toHaveBeenCalledWith('This action returns all cats');
  //   })
  // })

  describe('getQuestionList', () => {
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    it('getQuestionList()의 실행 결과 테스트', () => {
      const req = {
        page: '1',
      };

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith();
    });
  });

  // it('getQuestionList() 의 실행 결과 테스트', async () => {
  //   const req = { query: { page: '1' } };
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     send: jest.fn(),
  //   };
  //   await controller.getQuestionList({ page: '1' }, res);

  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.send).toHaveBeenCalledWith({
  //     message: 'ok',
  //     total_page_num: expect.any(Number),
  //     total_num: expect.any(Number),
  //     page_num: expect.any(Number),
  //     data: expect.any(Array),
  //   });
  // });
});

import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export const ApiHeaderToken = () => {
  return applyDecorators(
    ApiHeader({
      name: 'token',
      description: '파이어베이스(카카오) 토큰',
      required: true,
    }),
  );
};

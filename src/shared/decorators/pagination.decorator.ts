import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiPaginatedResponse = (model: any) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'ok',
      schema: {
        properties: {
          total_page_num: {
            type: 'number',
          },
          total_num: {
            type: 'number',
          },
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
        },
      },
    }),
  );
};

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { request, Response } from 'express';
import { FirebaseError } from 'firebase/app';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(exception);
    if (exception instanceof HttpException) {
      let data = exception.getResponse() as {
        message: any;
        statusCode: number;
      };
      response.status(status).json({
        code: status,
        data: data.message,
        path: request.url,
      });
    } else {
      let data = exception as { code: string; message: string };
      response.status(status).json({
        code: status,
        data: data.message,
        path: request.url,
      });
    }
  }
}

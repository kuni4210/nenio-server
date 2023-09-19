import { Controller, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import * as RequestDTO from './dto/files-request.dto';
import * as ResponseDTO from './dto/files-response.dto';

@ApiTags('File')
@Controller('api/file')
export class FilesController {
  constructor(private fileService: FilesService) {}

  @ApiOperation({ summary: '파일 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RequestDTO.uploadFilesBody })
  @ApiOkResponse({ description: 'success', type: ResponseDTO.uploadFiles })
  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files', null))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Res() res: any) {
    const imgUrl: string[] = [];
    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const key = await this.fileService.uploadFile(file);
        imgUrl.push(process.env.S3_URL + key);
      }),
    );
    return res.status(200).send({ message: 'success', data: imgUrl });
  }
}

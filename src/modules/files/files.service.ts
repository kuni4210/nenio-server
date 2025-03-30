import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class FilesService {
  private readonly s3;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const key = `${Date.now() + file.originalname}`;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      ACL: 'private',
      Key: key,
      Body: file.buffer,
    };

    return new Promise((resolve, reject) => {
      this.s3
        .send(new PutObjectCommand(params))
        .then(() => {
          resolve(key);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

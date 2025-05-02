import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiBody, ApiConsumes } from '@nestjs/swagger';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  
  @Controller('file')
  export class MulterController {
    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
            cb(null, uniqueName);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.startsWith('image/')) {
            cb(new BadRequestException('Разрешены только изображения'), false);
          } else {
            cb(null, true);
          }
        },
        limits: {
          fileSize: 5 * 1024 * 1024, 
        },
      }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('Файл обязателен');
      }
  
      return {
        message: 'Файл успешно загружен',
        filename: file.filename,
        url: `http://localhost:3000/uploads/${file.filename}`,
      };
    }
  }
  
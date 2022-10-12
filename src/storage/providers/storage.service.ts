import { EnvVariables } from '@/app-config/environment/env-variables.enum';
import { AppLoggerService } from '@/app-config/logger/logger.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { UploadResponseDto } from '../dto/upload-response.dto';

@Injectable()
export class StorageService {
  private readonly s3: S3;
  private readonly bucket: string;
  private context = this.constructor.name;
  constructor(
    private readonly config: ConfigService,
    private readonly logger: AppLoggerService,
  ) {
    this.s3 = new S3({
      accessKeyId: config.get(EnvVariables.AWS_S3_KEY),
      secretAccessKey: config.get(EnvVariables.AWS_S3_SECRET),
      region: config.get(EnvVariables.AWS_S3_REGION),
    });
    this.bucket = config.get(EnvVariables.AWS_S3_BUCKET);
  }

  async uploadFile(
    name: string,
    file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    const context = {
      method: this.uploadFile.name,
    };
    try {
      this.logger.customLog(this.context, {
        ...context,
        message: 'Uploading file',
      });
      const params = {
        Bucket: this.bucket,
        Key: name,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: this.config.get(EnvVariables.AWS_S3_REGION),
        },
      };
      const { ETag, Location } = await this.s3.upload(params).promise();
      this.logger.customLog(this.context, {
        ...context,
        message: 'Upload file success',
      });

      return { eTag: ETag, url: Location };
    } catch (error) {
      this.logger.customError(error);
      throw new InternalServerErrorException('File not save');
    }
  }

  async readFile(filename: string): Promise<NodeJS.ReadableStream> {
    const options = {
      Bucket: this.bucket,
      Key: filename,
    };

    try {
      const exist = await this.checkIfFileExist(filename);

      if (exist) {
        return this.s3.getObject(options).createReadStream();
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error when try access to file ${filename}`,
      );
    }
  }

  async checkIfFileExist(filename: string): Promise<boolean> {
    try {
      const fileAttributes = await this.s3
        .getObjectAttributes({
          Bucket: this.bucket,
          Key: filename,
          ObjectAttributes: ['ObjectSize'],
        })
        .promise();

      return fileAttributes.ObjectSize ? true : false;
    } catch (error) {
      throw new InternalServerErrorException(`Error when try find file`);
    }
  }
}

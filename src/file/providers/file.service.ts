import { AppLoggerService } from '@/app-config/logger/logger.service';
import { PrismaService } from '@/app-config/prisma/prisma.service';
import { StorageService } from '@/storage/providers/storage.service';
import { Injectable } from '@nestjs/common';
import { SaveFileDto } from '../dto/save-file.dto';
import { ReadFileDto } from '../dto/read-file.dto';

@Injectable()
export class FileService {
  private context = this.constructor.name;

  constructor(
    private readonly logger: AppLoggerService,
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async saveFile(payload: SaveFileDto): Promise<string> {
    const { file, userId, namespace } = payload;
    const { originalname, mimetype } = file;
    const fixedName = this.parseFilename(originalname);
    const context = {
      method: this.saveFile.name,
      name: fixedName,
    };

    const { eTag, url } = await this.storage.uploadFile(fixedName, file);

    this.logger.customLog(this.context, {
      ...context,
      message: 'Creating file record',
    });

    await this.prisma.file.create({
      data: {
        name: fixedName,
        namespace,
        url,
        key: eTag,
        filetype: mimetype,
        userId,
      },
    });

    this.logger.customLog(this.context, {
      ...context,
      message: 'Creating file record created',
    });

    return url;
  }

  async readFile(filename: string): Promise<ReadFileDto> {
    const file = await this.storage.readFile(filename);
    return { file, filename };
  }

  parseFilename(filename: string) {
    return filename.toLowerCase().replace(' ', '_').replace('-', '_');
  }
}

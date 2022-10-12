import { JwtGuard } from '@/user/guards/jwt.guard';
import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileService } from '../providers/file.service';

@ApiTags('Files')
@UseGuards(JwtGuard)
@ApiBearerAuth('jwt')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('/:name')
  async getFile(
    @Res() response,
    @Param('name') name: string,
  ): Promise<NodeJS.ReadableStream> {
    const { file, filename } = await this.fileService.readFile(name);
    response.attachment(filename);
    return file.pipe(response);
  }
}

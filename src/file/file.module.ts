import { StorageModule } from '@/storage/storage.module';
import { Module } from '@nestjs/common';
import { FileService } from './providers/file.service';
import { FileController } from './controllers/file.controller';

@Module({
  imports: [StorageModule],
  providers: [FileService],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}

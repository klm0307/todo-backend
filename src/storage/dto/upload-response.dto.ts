import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty()
  eTag: string;
  @ApiProperty()
  url: string;
}

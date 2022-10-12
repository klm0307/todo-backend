import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class FilterTodoDto {
  @ApiPropertyOptional({
    description: 'Unique id of todo to find',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    description: 'Unique id of user to find todos',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userId?: string;
}

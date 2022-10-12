import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';
export class CreateSubtaskDto extends CreateTodoDto {
  @ApiPropertyOptional({
    description: 'Id of user',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Expiration at of todo', example: '' })
  @IsDateString()
  @IsOptional()
  expiredAt?: Date;
}

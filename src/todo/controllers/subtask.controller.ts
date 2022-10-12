import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Subtask')
@Controller('subtask')
export class SubtaskController {}

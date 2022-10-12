import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from '../providers/user.service';
import { FilterUserDto } from '../dto/filter-user.dto';
import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { DefaultResponse } from '../../shared/responses/default.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../guards/jwt.guard';
import { User } from '../decorators/user.decorator';

@ApiTags('Users')
@UseGuards(JwtGuard)
@ApiBearerAuth('jwt')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: UserDto })
  @Get('me')
  async me(@Request() req): Promise<Partial<UserDto>> {
    return req.user;
  }

  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse(DefaultResponse.notFound)
  @ApiUnauthorizedResponse(DefaultResponse.unauthorized)
  @ApiParam({
    type: 'string',
    name: 'id',
    description: 'Id of user to find',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  async getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findUserById(id);
  }

  @Get()
  @ApiOkResponse({ type: [UserDto] })
  @ApiUnauthorizedResponse(DefaultResponse.unauthorized)
  @ApiBadRequestResponse(DefaultResponse.badRequest)
  @ApiUnprocessableEntityResponse(DefaultResponse.unprocessableEntity)
  getAllUsers(@Query() query: FilterUserDto) {
    return this.userService.findAllUsers(query);
  }

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  @ApiUnauthorizedResponse(DefaultResponse.unauthorized)
  @ApiConflictResponse(DefaultResponse.conflict)
  @ApiBadRequestResponse(DefaultResponse.badRequest)
  @ApiUnprocessableEntityResponse(DefaultResponse.unprocessableEntity)
  async createUser(@Body() payload: CreateUserDto) {
    return this.userService.createUser(payload);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse(DefaultResponse.notFound)
  @ApiUnauthorizedResponse(DefaultResponse.unauthorized)
  @ApiBadRequestResponse(DefaultResponse.badRequest)
  @ApiUnprocessableEntityResponse(DefaultResponse.unprocessableEntity)
  @ApiParam({
    type: 'string',
    name: 'id',
    description: 'Id of user to update',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  async updateUser(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.userService.updateUser(id, payload);
  }

  @Delete(':id')
  @ApiNotFoundResponse(DefaultResponse.notFound)
  @ApiUnauthorizedResponse(DefaultResponse.unauthorized)
  @ApiUnprocessableEntityResponse(DefaultResponse.unprocessableEntity)
  @ApiParam({
    type: 'string',
    name: 'id',
    description: 'Id of user to delete',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Post('/upload-image')
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
  @UseInterceptors(FileInterceptor('file'))
  async saveFile(
    @User() user: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.userService.saveUserImage(user.id, file);
  }
}

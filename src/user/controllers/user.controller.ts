import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { UserService } from '../providers/user.service';
import { UserDto } from '../dto/user.dto';
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

  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: UserDto })
  async me(@Request() req): Promise<Partial<UserDto>> {
    return req.user;
  }

  @Patch()
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse(DefaultResponse.notFound)
  @ApiUnauthorizedResponse(DefaultResponse.unauthorized)
  @ApiBadRequestResponse(DefaultResponse.badRequest)
  @ApiUnprocessableEntityResponse(DefaultResponse.unprocessableEntity)
  async updateUser(@User() user: UserDto, @Body() payload: UpdateUserDto) {
    return this.userService.updateUser(user.id, payload);
  }

  @Delete()
  @ApiNotFoundResponse(DefaultResponse.notFound)
  @ApiUnauthorizedResponse(DefaultResponse.unauthorized)
  @ApiUnprocessableEntityResponse(DefaultResponse.unprocessableEntity)
  @ApiParam({
    type: 'string',
    name: 'id',
    description: 'Id of user to delete',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  async deleteUser(@User() user: UserDto) {
    return this.userService.deleteUser(user.id);
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

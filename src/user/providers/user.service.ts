import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AppLoggerService } from '@config/logger/logger.service';
import { PrismaService } from '@config/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserDto } from '../dto/user.dto';
import { FilterUserDto } from '../dto/filter-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FileNamespace } from '@/storage/enum/file-namespace.enum';
import { hash } from 'bcrypt';
import { FileService } from '@/file/providers/file.service';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { MailerService } from '@nestjs-modules/mailer';

type PartialFilter = Partial<FilterUserDto>;
type PartialUpdateUser = Partial<UpdateUserDto>;

@Injectable()
export class UserService {
  private context = this.constructor.name;

  constructor(
    private readonly logger: AppLoggerService,
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
    private readonly i18n: I18nRequestScopeService,
    private readonly mailerService: MailerService,
  ) {}

  async findAllUsers(query: PartialFilter = {}): Promise<UserDto[]> {
    const context = {
      method: this.findAllUsers.name,
      filter: { ...query },
    };

    try {
      const { id, name, email } = query;
      const where: Prisma.UserWhereInput = {};

      if (email) {
        where.email = {
          equals: email,
        };
      }

      if (name) {
        where.name = {
          contains: name,
        };
      }

      if (id) {
        where.id = {
          equals: id,
        };
      }

      this.logger.customLog(this.context, {
        ...context,
        message: 'Finding all users',
      });

      const users = await this.prisma.user.findMany({ where });

      this.logger.customLog(this.context, {
        context,
        message: `Found ${users.length} users`,
      });

      return users;
    } catch (error) {
      throw new BadRequestException(
        this.i18n.translate('user.errors.general', {
          args: { name: this.findAllUsers.name },
        }),
      );
    }
  }

  async findUserById(id: string) {
    const [user] = await this.findAllUsers({ id });

    if (!user) {
      throw new NotFoundException(
        this.i18n.translate('user.errors.not_found', { args: { id } }),
      );
    }

    return user;
  }

  async findUserByEmail(email: string) {
    const [user] = await this.findAllUsers({ email });
    return user;
  }

  async createUser(payload: CreateUserDto): Promise<UserDto> {
    const context = {
      method: this.createUser.name,
      payload,
    };

    const { email } = payload;

    const exist = await this.findUserByEmail(email);

    if (exist) {
      throw new ConflictException(
        this.i18n.translate('user.errors.conflict', { args: { email } }),
      );
    }

    try {
      this.logger.customLog(this.context, {
        ...context,
        message: 'Creating user',
      });

      const user = await this.prisma.user.create({
        data: { ...payload, password: await hash(payload.password, 10) },
      });

      await this.mailerService.sendMail({
        to: payload.email,
        subject: 'Change password',
        template: 'new-user.hbs',
        context: {
          name: payload.name,
        },
      });

      this.logger.customLog(this.context, {
        context,
        message: `User created with id ${user.id}`,
      });
      return user;
    } catch (error) {
      this.logger.customError(error);
      throw new UnprocessableEntityException(
        this.i18n.translate('user.errors.unprocessable.create', {
          args: { email },
        }),
      );
    }
  }

  async updateUser(id: string, payload: PartialUpdateUser): Promise<UserDto> {
    const context = {
      method: this.createUser.name,
      payload,
    };

    await this.findUserById(id);

    try {
      this.logger.customLog(this.context, {
        ...context,
        message: 'Updating user',
      });

      const user = await this.prisma.user.update({
        where: { id },
        data: { ...payload, updatedAt: new Date() },
      });

      this.logger.customLog(this.context, {
        context,
        message: `User with id ${user.id} updated`,
      });
      return user;
    } catch (error) {
      throw new UnprocessableEntityException(
        this.i18n.translate('user.errors.unprocessable.update', {
          args: { id },
        }),
      );
    }
  }

  async deleteUser(id: string): Promise<UserDto> {
    const context = {
      method: this.deleteUser.name,
      id,
    };

    await this.findUserById(id);

    try {
      this.logger.customLog(this.context, {
        ...context,
        message: 'Deleting user',
      });

      const user = await this.prisma.user.delete({
        where: { id },
      });

      this.logger.customLog(this.context, {
        context,
        message: `User with id ${user.id} deleted`,
      });
      return user;
    } catch (error) {
      throw new UnprocessableEntityException(
        this.i18n.translate('user.errors.unprocessable.delete', {
          args: { id },
        }),
      );
    }
  }

  async saveUserImage(id: string, file: Express.Multer.File) {
    const url = await this.fileService.saveFile({
      file,
      userId: id,
      namespace: FileNamespace.USER_NAMESPACE,
    });

    await this.updateUser(id, { photoUrl: url });

    return url;
  }
}

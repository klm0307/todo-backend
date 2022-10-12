import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    this.$use(async (params, next) => {
      if (params.action == 'delete') {
        params.action = 'update';
        params.args['data'] = { deletedAt: new Date() };
      }
      if (params.action == 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data != undefined) {
          params.args.data['deletedAt'] = true;
        } else {
          params.args['data'] = { deletedAt: new Date() };
        }
      }

      if (params.action == 'findUnique') {
        params.action = 'findFirst';
        const where = params.args.where;
        params.args.where = {};
        for (const arg of Object.entries(where)) {
          if (typeof arg[1] !== 'object') {
            params.args.where[arg[0]] = arg[1];
          } else {
            for (const subarg of Object.entries(
              arg[1] as Record<string, unknown>,
            )) {
              params.args.where[subarg[0]] = subarg[1];
            }
          }
        }
        params.args.where['deletedAt'] = null;
      }

      if (params.action == 'findMany') {
        if (!params.args) {
          params.args = {};
        }
        if (params.args?.where != undefined) {
          if (params.args.where.deletedAt == undefined) {
            params.args.where['deletedAt'] = null;
          }
        } else {
          params.args['where'] = { deletedAt: null };
        }
      }

      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}

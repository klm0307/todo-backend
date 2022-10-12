import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService extends ConsoleLogger {
  public customError(error: Error) {
    super.error(`${error.name}: ${error.message}.`, error.stack, this.context);
  }
  public customLog(context: string, data: any) {
    super.log(JSON.stringify(data), context);
  }
}

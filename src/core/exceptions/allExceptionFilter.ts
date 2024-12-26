import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const message = exception?.messgae
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        exception?.messgae
      : 'Internal server error';

    this.logger.error(`Status: ${status} Error: ${JSON.stringify(exception, null, 2)}`);

    if (response instanceof Response) {
      response.status(status).json({
        statusCode: status,
        message,
      });
    }
  }
}

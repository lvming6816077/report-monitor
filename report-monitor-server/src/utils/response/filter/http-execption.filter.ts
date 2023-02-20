import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Inject,
} from '@nestjs/common';

import {
    WINSTON_MODULE_PROVIDER,
    WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const { url } = ctx.getRequest();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // console.log(exception)
        const message =
            (exception as any)?.response?.message ||
            (exception as any)?.message ||
            'Bad Request';

        this.logger.error(
            JSON.stringify({
                error: message,
                path: url,
            }),
        );

        response.status(status).json({
            code: status,
            // timestamp,
            path: url,
            message,
        });
    }
}

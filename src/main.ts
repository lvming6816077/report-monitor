import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ResponseTransformInterceptor } from './utils/response/interceptor/response.default.interceptor';
import { AllExceptionsFilter } from './utils/response/filter/http-execption.filter';
import { ValidationPipe } from '@nestjs/common'
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {

    });
    app.setGlobalPrefix('rapi');
    app.useGlobalPipes(new ValidationPipe({
        disableErrorMessages: false, // 不显示错误信息
        whitelist: false, // 开启过滤 多传字段不报错
    }))
    app.use(cookieParser());
    app.use(session({
        secret: 'averylogphrasebiggerthanthirtytwochars',
        resave: false,
        saveUninitialized: false,
    }),
    );
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(app.get(AllExceptionsFilter));
    await app.listen(3001);
}
bootstrap();

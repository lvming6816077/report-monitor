import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 200,
          message: '请求成功',
        };
      }),
    );
  }
}
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@icms/shared';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || 200;

    return next.handle().pipe(
      map((data) => {
        // If data is already in standard format, return it
        if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
          return data;
        }

        return {
          success: true,
          statusCode,
          message: data?.message || 'Operation successful',
          data: data?.data !== undefined ? data.data : data,
          meta: data?.meta,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}


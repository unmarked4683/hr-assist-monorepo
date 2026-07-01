import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import {
  ResponseWrapper,
  createSuccessResponse,
} from '../types/response-wrapper.types';

@Injectable()
export class ResponseWrapperInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseWrapper<unknown>> {
    return next.handle().pipe(map((data) => createSuccessResponse(data)));
  }
}

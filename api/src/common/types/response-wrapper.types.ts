export interface ApiErrorPayload {
  message: string;
  statusCode: number;
}

export interface SuccessResponse<T> {
  data: T;
  isError: false;
  error: null;
}

export interface FailureResponse {
  data: null;
  isError: true;
  error: ApiErrorPayload;
}

export type ResponseWrapper<T> = SuccessResponse<T> | FailureResponse;

export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    data,
    isError: false,
    error: null,
  };
}

export function createFailureResponse(
  error: ApiErrorPayload,
): FailureResponse {
  return {
    data: null,
    isError: true,
    error,
  };
}

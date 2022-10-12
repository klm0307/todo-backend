import { ApiResponseOptions } from '@nestjs/swagger';

export type SwaggerResponseOptions = {
  ok?: ApiResponseOptions;
  created?: ApiResponseOptions;
  unauthorized?: ApiResponseOptions;
  badRequest?: ApiResponseOptions;
  unprocessableEntity?: ApiResponseOptions;
  conflict?: ApiResponseOptions;
  notFound?: ApiResponseOptions;
};

export const HttpResponse = {
  status: { type: 'number' },
  message: { type: 'string' },
};

export const DefaultResponse: SwaggerResponseOptions = {
  ok: {
    schema: { properties: HttpResponse, example: { status: 200, message: '' } },
  },
  created: {
    schema: { properties: HttpResponse, example: { status: 201, message: '' } },
  },
  unauthorized: {
    schema: { properties: HttpResponse, example: { status: 401, message: '' } },
  },
  badRequest: {
    schema: { properties: HttpResponse, example: { status: 400, message: '' } },
  },
  unprocessableEntity: {
    schema: { properties: HttpResponse, example: { status: 422, message: '' } },
  },
  conflict: {
    schema: { properties: HttpResponse, example: { status: 409, message: '' } },
  },
  notFound: {
    schema: { properties: HttpResponse, example: { status: 404, message: '' } },
  },
};

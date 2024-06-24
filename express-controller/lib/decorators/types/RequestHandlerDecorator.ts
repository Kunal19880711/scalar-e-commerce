import { RequestHandler } from 'express';
import { MethodDecorator } from './MethodDecorator';

export type RequestHandlerDecorator = MethodDecorator<RequestHandler>;

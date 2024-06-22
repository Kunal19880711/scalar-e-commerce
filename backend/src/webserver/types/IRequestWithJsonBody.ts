import { Request } from "express";

export interface IRequestWithJsonBody<T> extends Request {
  body: T;
}

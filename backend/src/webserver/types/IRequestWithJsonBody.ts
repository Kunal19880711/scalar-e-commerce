import { Request } from "express";

export interface IRequestWithJsonBody<T> extends Request<{}, {}, T> {
  body: T;
}

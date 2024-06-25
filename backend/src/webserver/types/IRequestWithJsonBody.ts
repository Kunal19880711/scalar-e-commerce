import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core"; 

export interface IRequestWithJsonBody<T> extends Request<ParamsDictionary, {}, T> {
  body: T;
}

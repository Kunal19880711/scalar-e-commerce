import { Request, Response, NextFunction } from "express";

export interface IAsyncMiddleware {
  (req: Request, res: Response, next: NextFunction, id ?: string): Promise<void>;
}

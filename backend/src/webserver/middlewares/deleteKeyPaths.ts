import { NextFunction, RequestHandler, Request, Response } from "express";

export function deleteKeyPaths(keysPaths: string[]): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction): void {
    try {
      if (!req.body) {
        next();
        return;
      }
      for (const keyPath of keysPaths) {
        delete req.body[keyPath];
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

import { RequestHandler } from "express";

export type MethodDecorator<T> = (
  target: T,
  ctx: ClassMethodDecoratorContext
) => void;

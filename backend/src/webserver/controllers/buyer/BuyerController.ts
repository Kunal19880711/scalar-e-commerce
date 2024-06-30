import { NextFunction, Request, Response } from "express";
import { controller, get, patch } from "express-controller";
import { HttpStatus, Paths } from "../../../constants";
import {
  respondSuccess,
  getUserData,
  changeQueryForExtraOptions,
} from "../../webServerUtils";
import { requireAuth } from "../decorators";

@controller(Paths.BuyerApi)
export class BuyerController {
  @get(Paths.EMPTY)
  @requireAuth()
  async getBuyerData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = await getUserData(req, {
        populate: ["cart.product"],
      });
      respondSuccess(res, HttpStatus.Found, userData);
    } catch (err) {
      next(err);
    }
  }
}

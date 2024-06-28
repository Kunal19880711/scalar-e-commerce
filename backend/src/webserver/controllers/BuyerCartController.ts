import { Request, Response, NextFunction } from "express";
import { controller, del, patch, post } from "express-controller";

import { HttpStatus, Paths } from "../../constants";
import { ICartItem } from "../../persistence";
import { ApiError, IRequestWithJsonBody } from "../types";
import { getUserData, respondSuccess } from "../webServerUtils";

import { requireAuth } from "./decorators";

@controller(Paths.CartApi)
export class BuyerCartController {
  @post(Paths.EMPTY)
  @requireAuth()
  async addCartItem(
    req: IRequestWithJsonBody<ICartItem>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = await getUserData(req);
      userData.cart = userData.cart || [];
      userData.cart.push(req.body);
      const updatedUser = await userData.save();
      respondSuccess(
        res,
        HttpStatus.OK,
        updatedUser,
        "Cart item added successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  @patch(Paths.ID)
  @requireAuth()
  async updateCartItem(
    req: IRequestWithJsonBody<ICartItem>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      const userData = await getUserData(req, { populate: ["cart.product"] });
      const userObj = userData.toObject();
      userData.cart = userData.cart || [];
      const cartItemIndex = userData.cart.findIndex(
        (cartItem: ICartItem) => cartItem.id.toString() === id
      );

      if (cartItemIndex === -1) {
        throw new ApiError(HttpStatus.BadRequest, "Cart item not found.");
      }

      const updatedCartItem: ICartItem = {
        ...userObj.cart[cartItemIndex],
        ...req.body,
        updatedAt: new Date(),
      };

      userData.cart[cartItemIndex] = updatedCartItem;

      const updatedUser = await userData.save();
      respondSuccess(
        res,
        HttpStatus.OK,
        updatedUser,
        "Cart item modified successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  @del(Paths.ID)
  @requireAuth()
  async deleteCartItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      const userData = await getUserData(req);
      userData.cart = userData.cart || [];
      const cartItemIndex = userData.cart.findIndex(
        (cartItem: ICartItem) => cartItem.id.toString() === id
      );

      if (cartItemIndex === -1) {
        throw new ApiError(HttpStatus.BadRequest, "Cart item not found.");
      }

      userData.cart.splice(cartItemIndex, 1);
      const updatedUser = await userData.save();
      respondSuccess(
        res,
        HttpStatus.OK,
        updatedUser,
        "Cart item deleted successfully"
      );
    } catch (err) {
      next(err);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { controller, del, patch, post, get } from "express-controller";

import { HttpStatus, Paths } from "../../../constants";
import {
  ICartItem,
  IUserData,
  ProductModel,
  cartMandatoryKeyPaths,
} from "../../../persistence";
import {
  ApiError,
  IRequestWithJsonBody,
  ValidationErrorDetail,
} from "../../types";
import { getUserData, respondSuccess } from "../../webServerUtils";
import { requireAuth, requireBodyValidator } from "../decorators";

const cartApiMandatoryKeyPaths = cartMandatoryKeyPaths.filter(
  (keyPath) => keyPath !== "total"
);

@controller(Paths.CartApi)
export class CartController {
  @get(Paths.EMPTY)
  @requireAuth()
  async getCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = await getUserData(req, { populate: ["cart.product"] });
      respondSuccess(res, HttpStatus.Found, userData.cart);
    } catch (err) {
      next(err);
    }
  }

  @post(Paths.EMPTY)
  @requireAuth()
  @requireBodyValidator(...cartApiMandatoryKeyPaths)
  async addCartItem(
    req: IRequestWithJsonBody<ICartItem>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = await getUserData(req, {
        populate: ["cart.product"],
      });
      req.body.total = await getPrice(req.body);
      userData.cart = userData.cart || [];
      userData.cart.splice(0, 0, req.body);

      let updatedUser = await userData.save();
      updatedUser = await updatedUser.populate("cart.product");
      respondSuccess(
        res,
        HttpStatus.OK,
        (updatedUser.cart as ICartItem[])[0],
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
      const userData = await getUserData(req);
      const userObj = userData.toObject();
      userData.cart = userData.cart || [];
      const cartItemIndex = userData.cart.findIndex(
        (cartItem: ICartItem) => cartItem._id.toString() === id
      );

      if (cartItemIndex === -1) {
        throw new ApiError(HttpStatus.BadRequest, "Cart item not found.");
      }

      const updatedCartItem: ICartItem = {
        ...userObj.cart[cartItemIndex],
        ...req.body,
        updatedAt: new Date(),
      };
      updatedCartItem.total = await getPrice(updatedCartItem);

      userData.cart[cartItemIndex] = updatedCartItem;

      let updatedUser = await userData.save();
      updatedUser = await updatedUser.populate("cart.product");
      respondSuccess(
        res,
        HttpStatus.OK,
        (updatedUser.cart as ICartItem[])[cartItemIndex],
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
      const userData = await getUserData(req, { populate: ["cart.product"] });
      userData.cart = userData.cart || [];
      const cartItemIndex = userData.cart.findIndex(
        (cartItem: ICartItem) => cartItem._id.toString() === id
      );

      if (cartItemIndex === -1) {
        throw new ApiError(HttpStatus.BadRequest, "Cart item not found.");
      }

      const deleted = userData.cart.splice(cartItemIndex, 1);
      const updatedUser = await userData.save();
      respondSuccess(
        res,
        HttpStatus.OK,
        deleted[0],
        "Cart item deleted successfully"
      );
    } catch (err) {
      next(err);
    }
  }
}

async function getPrice(cartItem: ICartItem): Promise<number> {
  const productId: string = cartItem.product.toString();
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(HttpStatus.BadRequest, [
      new ValidationErrorDetail("product", [`Product ${productId} not found.`]),
    ]);
  }
  const productPrice = product.price as number;
  return productPrice * cartItem.quantity;
}

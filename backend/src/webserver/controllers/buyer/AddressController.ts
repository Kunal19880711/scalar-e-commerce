import { Request, Response, NextFunction } from "express";
import { controller, del, patch, post, get } from "express-controller";

import { IAddress, addressMandatoryKeyPaths } from "../../../persistence";
import { ApiError, IRequestWithJsonBody } from "../../types";
import { HttpStatus, Paths } from "../../../constants";
import { getUserData, respondSuccess } from "../../webServerUtils";
import { requireBodyValidator, requireAuth } from "../decorators";

@controller(Paths.AddressApi)
export class BuyerAddressController {
  @get(Paths.EMPTY)
  @requireAuth()
  async getAddresses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = await getUserData(req);
      respondSuccess(res, HttpStatus.Found, userData.addresses);
    } catch (err) {
      next(err);
    }
  }

  @post(Paths.EMPTY)
  @requireAuth()
  @requireBodyValidator(...addressMandatoryKeyPaths)
  async addAddress(
    req: IRequestWithJsonBody<IAddress>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = await getUserData(req);
      const newAddress = req.body as IAddress;
      userData.addresses = userData.addresses || [];
      userData.addresses.splice(0, 0, newAddress);
      const savedUSer = await userData.save();
      respondSuccess(
        res,
        HttpStatus.OK,
        (savedUSer.addresses as IAddress[])[0],
        "Address added successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  @patch(Paths.ID)
  @requireAuth()
  async updateAddress(
    req: IRequestWithJsonBody<IAddress>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      const userData = await getUserData(req);
      const userObj = userData.toObject();
      userData.addresses = userData.addresses || [];

      const addressIndex = userData.addresses.findIndex(
        (address: IAddress) => address.id.toString() === id
      );

      if (addressIndex === -1) {
        throw new ApiError(HttpStatus.BadRequest, "Address not found");
      }

      userData.addresses[addressIndex] = {
        ...(userObj.addresses as IAddress[])[addressIndex],
        ...req.body,
        updatedAt: new Date(),
      };

      const updatedUser = await userData.save();

      respondSuccess(
        res,
        HttpStatus.OK,
        (updatedUser.addresses as IAddress[])[addressIndex],
        "Address updated successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  @del(Paths.ID)
  @requireAuth()
  async deleteAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      const userData = await getUserData(req);
      const userObj = userData.toObject();
      userData.addresses = userData.addresses || [];

      const addressIndex = userData.addresses.findIndex(
        (address: IAddress) => address.id.toString() === id
      );

      if (addressIndex === -1) {
        throw new ApiError(HttpStatus.BadRequest, "Address not found");
      }

      const deletedAddress = userData.addresses.splice(addressIndex, 1);
      await userData.save();

      respondSuccess(
        res,
        HttpStatus.OK,
        deletedAddress,
        "Address deleted successfully"
      );
    } catch (err) {
      next(err);
    }
  }
}

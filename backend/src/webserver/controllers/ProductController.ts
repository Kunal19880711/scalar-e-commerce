import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../../persistence";
import {
  getAllResources,
  getResourceById,
  createResource,
  deleteResourceById,
  updateResourceById,
} from "../webServerUtils";
import {
  controller,
  get,
  patch,
  post,
  del,
  requireAuthentication,
  requireAuthorization,
} from "./decorators";
import { Paths, Roles } from "../../constants";

const getAllProducts = getAllResources(ProductModel);
const getProductById = getResourceById(ProductModel);
const createProduct = createResource(ProductModel);
const deleteProductById = deleteResourceById(ProductModel);
const updateProductById = updateResourceById(ProductModel);

@controller({
  routePrefix: Paths.ProductApi,
  requireAuthentication: true,
  authorizedRoles: [Roles.Admin],
})
export class ProductController {
  @get(Paths.EMPTY)
  @requireAuthorization(Roles.Buyer)
  async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await getAllProducts(req, res, next);
  }

  @get(Paths.ID)
  @requireAuthorization(Roles.Buyer)
  async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await getProductById(req, res, next);
  }

  @post(Paths.EMPTY)
  @requireAuthorization(Roles.Seller)
  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await createProduct(req, res, next);
  }

  @patch(Paths.ID)
  @requireAuthorization(Roles.Seller)
  async updateProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await updateProductById(req, res, next);
  }

  @del(Paths.ID)
  @requireAuthorization(Roles.Seller)
  async deleteProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await deleteProductById(req, res, next);
  }
}

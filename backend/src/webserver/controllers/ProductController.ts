import { Request, Response, NextFunction } from "express";
import { controller, get, patch, post, del } from "express-controller";
import { ProductModel } from "../../persistence";
import {
  getAllResources,
  getResourceById,
  createResource,
  deleteResourceById,
  updateResourceById,
} from "../webServerUtils";
import { requireAuth } from "./decorators";
import { Paths, Roles } from "../../constants";

const getAllProducts = getAllResources(ProductModel);
const getProductById = getResourceById(ProductModel);
const createProduct = createResource(ProductModel);
const deleteProductById = deleteResourceById(ProductModel);
const updateProductById = updateResourceById(ProductModel);

@controller(Paths.ProductApi)
export class ProductController {
  @get(Paths.EMPTY)
  async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await getAllProducts(req, res, next);
  }

  @get(Paths.ID)
  async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await getProductById(req, res, next);
  }

  @post(Paths.EMPTY)
  @requireAuth(Roles.Admin)
  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await createProduct(req, res, next);
  }

  @patch(Paths.ID)
  @requireAuth(Roles.Admin)
  async updateProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await updateProductById(req, res, next);
  }

  @del(Paths.ID)
  @requireAuth(Roles.Admin)
  async deleteProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await deleteProductById(req, res, next);
  }
}

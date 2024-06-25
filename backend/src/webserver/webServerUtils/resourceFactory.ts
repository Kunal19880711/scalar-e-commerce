import { HydratedDocument, Model } from "mongoose";
import { ApiError, IAsyncMiddleware } from "../types";
import { HttpStatus } from "../../constants";
import { respondSuccess } from "./respondUtils";

export type ExtraOptions = {
  populate?: string[];
};

export const createResource =
  <T>(model: Model<T>, extraOptions?: ExtraOptions): IAsyncMiddleware =>
  async (req, res, next) => {
    try {
      const newResource = req.body;
      let dbQuery = model.create(newResource);
      dbQuery = changeQueryForExtraOptions(dbQuery, extraOptions);
      const resource: T = await dbQuery;
      respondSuccess(res, HttpStatus.Created, resource);
    } catch (err: Error | any) {
      next(err);
    }
  };

export const getAllResources =
  <T>(model: Model<T>, extraOptions?: ExtraOptions): IAsyncMiddleware =>
  async (req, res, next) => {
    try {
      let dbQuery = model.find();

      const sort = req.query?.sort as string | undefined;
      if (sort) {
        const [param, direction] = sort?.split("_") || [];
        dbQuery = dbQuery.sort({ [param]: direction === "desc" ? -1 : 1 });
      }

      const page = req.query?.sort as string | undefined;
      const limit = req.query?.sort as string | undefined;
      if (page && limit) {
        dbQuery = dbQuery
          .skip((parseInt(page) - 1) * parseInt(limit))
          .limit(parseInt(limit));
      }
      dbQuery = changeQueryForExtraOptions(dbQuery, extraOptions);

      const data: T[] = await dbQuery;
      if (data.length === 0) {
        throw new ApiError(HttpStatus.NotFound, "Resource not found");
      }
      respondSuccess(res, HttpStatus.Found, data);
    } catch (err: Error | any) {
      next(err);
    }
  };

export const getResourceById =
  <T>(model: Model<T>, extraOptions?: ExtraOptions): IAsyncMiddleware =>
  async (req, res, next) => {
    try {
      const id = req.params.id;
      let dbQuery = model.findById(id);
      dbQuery = changeQueryForExtraOptions(dbQuery, extraOptions);

      const resource: T | null = await dbQuery;
      if (!resource) {
        throw new ApiError(HttpStatus.NotFound, "Resource not found");
      }
      respondSuccess(res, HttpStatus.Found, resource);
    } catch (err: Error | any) {
      next(err);
    }
  };

export const deleteResourceById =
  <T>(model: Model<T>): IAsyncMiddleware =>
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const deletedResource: T | null = await model.findByIdAndDelete(id);
      if (!deletedResource) {
        throw new ApiError(HttpStatus.NotFound, "Resource not found");
      }
      respondSuccess(res, HttpStatus.Deleted, deletedResource);
    } catch (err: Error | any) {
      next(err);
    }
  };

export const updateResourceById =
  <T>(model: Model<T>, extraOptions?: ExtraOptions): IAsyncMiddleware =>
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const resource: HydratedDocument<T> | null = await model.findById(id);
      if (!resource) {
        throw new ApiError(HttpStatus.NotFound, "Resource not found");
      }
      resource.set(req.body);

      let dbQuery = resource.save();
      dbQuery = changeQueryForExtraOptions(dbQuery, extraOptions);
      const updateResource = await dbQuery;
      if (!resource) {
        throw new ApiError(HttpStatus.NotFound, "Resource not found");
      }
      respondSuccess(res, HttpStatus.Updated, updateResource);
    } catch (err: Error | any) {
      next(err);
    }
  };

export function changeQueryForExtraOptions(query: any, extraOptions?: ExtraOptions) {
  if (!extraOptions) {
    return query;
  }
  if (extraOptions.populate) {
    for (const keyPath of extraOptions.populate) {
      query = query.populate(keyPath);
    }
  }
  return query;
}

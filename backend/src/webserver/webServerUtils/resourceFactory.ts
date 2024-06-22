import { Model } from "mongoose";
import { ApiError, IAsyncMiddleware } from "../types";
import { HttpStatus } from "../../constants";
import { respondSuccess } from "./respondUtils";

export const createResource =
  <T>(model: Model<T>): IAsyncMiddleware =>
  async (req, res, next) => {
    try {
      const newResource = req.body;
      const resource: T = await model.create(newResource);
      respondSuccess(res, HttpStatus.Created, resource);
    } catch (err: Error | any) {
      next(err);
    }
  };

export const getAllResources =
  <T>(model: Model<T>): IAsyncMiddleware =>
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

      const data: T[] = await dbQuery;
      if (data.length === 0) {
        next(new ApiError(HttpStatus.NotFound, "Resource not found"));
        return;
      }
      respondSuccess(res, HttpStatus.Found, data);
    } catch (err: Error | any) {
      next(err);
    }
  };

export const getResourceById =
  <T>(model: Model<T>): IAsyncMiddleware =>
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const resource: T | null = await model.findById(id);
      if (!resource) {
        next(new ApiError(HttpStatus.NotFound, "Resource not found"));
        return;
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
        next(new ApiError(HttpStatus.NotFound, "Resource not found"));
        return;
      }
      respondSuccess(res, HttpStatus.Deleted, deletedResource);
    } catch (err: Error | any) {
      next(err);
    }
  };

export const updateResourceById =
  <T>(model: Model<T>): IAsyncMiddleware =>
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const updateResource: T | null = await model.findByIdAndUpdate(
        id,
        req.body,
        {
          returnDocument: "after",
        }
      );
      if (!updateResource) {
        next(new ApiError(HttpStatus.NotFound, "Resource not found"));
        return;
      }
      respondSuccess(res, HttpStatus.Updated, updateResource);
    } catch (err: Error | any) {
      next(err);
    }
  };

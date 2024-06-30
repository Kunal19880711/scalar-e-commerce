import { Request } from "express";
import { IUserData, IUserInfo, UserDataModel } from "../../persistence";
import { AccountDeletedError, ExtraOptions } from "../types";
import { changeQueryForExtraOptions } from "./mongooseQueryUtils";

export async function getUserData(
  req: Request,
  extraOptions?: ExtraOptions
): Promise<IUserData> {
  const userInfo = req?.requestInfo?.userInfo as IUserInfo;
  let query = UserDataModel.findOne({ userId: userInfo.userId });
  query = changeQueryForExtraOptions(query, extraOptions);
  const userData = await query;
  if (!userData) {
    throw AccountDeletedError;
  }
  return userData;
}
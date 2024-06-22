import { IUserInfo } from "./IUserInfo";

export interface IRequestInfo {
  userInfo?: IUserInfo;
}

declare global {
  namespace Express {
    interface Request {
      requestInfo?: IRequestInfo;
    }
  }
}

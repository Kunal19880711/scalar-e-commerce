import { IUserInfo } from "../../persistence";

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

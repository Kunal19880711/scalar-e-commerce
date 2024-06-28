import { HttpStatus } from "../../constants";
import { ApiError } from "./IApplicationError";

export const AccountDeletedError = new ApiError(
  HttpStatus.Unauthorized,
  "Your Account has been deleted."
);

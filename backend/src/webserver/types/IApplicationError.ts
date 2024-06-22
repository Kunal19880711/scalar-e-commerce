import { HttpStatus } from "../../constants";

export enum ErrorTypes {
  ApiError = "ApiError",
}

export interface IApplicationError extends Error {
  type: ErrorTypes;
}

export enum ErrorDetailType {
  ValidationError = "ValidationError",
}

export interface IErrorDetail {
  type: ErrorDetailType;
}

export interface IValidationErrorDetail extends IErrorDetail {
  type: ErrorDetailType.ValidationError;
  fieldPath: string;
  errors: string[];
}

export class ValidationErrorDetail implements IValidationErrorDetail {
  type: ErrorDetailType.ValidationError = ErrorDetailType.ValidationError;

  constructor(public fieldPath: string, public errors: string[]) {}
}

export interface IApiError extends IApplicationError {
  type: ErrorTypes.ApiError;
  status: HttpStatus;
  errorDetails?: IErrorDetail[];
}

export class ApiError extends Error implements IApiError {
  type: ErrorTypes.ApiError = ErrorTypes.ApiError;

  constructor(
    public status: HttpStatus,
    message: string,
    public errorDetails?: IErrorDetail[]
  ) {
    super(message);
  }
}

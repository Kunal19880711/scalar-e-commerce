import { HttpStatus, IHttpStatus } from "../../constants";

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
  status: IHttpStatus;
  errorDetails?: IErrorDetail[];
}

export class ApiError extends Error implements IApiError {
  type: ErrorTypes.ApiError = ErrorTypes.ApiError;
  errorDetails?: IErrorDetail[];

  constructor(
    public status: IHttpStatus,
    messageOrErrorDetail?: string | IErrorDetail[],
    errorDetails?: IErrorDetail[]
  ) {
    super(
      messageOrErrorDetail && !Array.isArray(messageOrErrorDetail)
        ? messageOrErrorDetail
        : status.message
    );
    this.status = status;
    this.errorDetails = Array.isArray(messageOrErrorDetail)
      ? messageOrErrorDetail
      : errorDetails;
  }
}

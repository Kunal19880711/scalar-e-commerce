export type IHttpStatus = {
  code: number;
  message: string;
};

export abstract class HttpStatus {
  public static readonly OK: IHttpStatus = {
    code: 200,
    message: "OK",
  };
  public static readonly Found: IHttpStatus = {
    code: 200,
    message: "Resource found",
  };
  public static readonly Updated: IHttpStatus = {
    code: 200,
    message: "Resource updated successfully,",
  };
  public static readonly Deleted: IHttpStatus = {
    code: 200,
    message: "Resource deleted successfully.",
  };
  public static readonly Created: IHttpStatus = {
    code: 201,
    message: "Resource created successfully.",
  };
  public static readonly BadRequest: IHttpStatus = {
    code: 400,
    message: "Validation Errors.",
  };
  public static readonly Unauthorized: IHttpStatus = {
    code: 401,
    message: "You are Unauthorized. Please authenticate first.",
  };
  public static readonly Forbidden: IHttpStatus = {
    code: 403,
    message: "You are Forbidden to access this resource.",
  };
  public static readonly NotFound: IHttpStatus = {
    code: 404,
    message: "Resource not found.",
  };
  public static readonly InternalServerError: IHttpStatus = {
    code: 500,
    message: "Internal server error.",
  };
}

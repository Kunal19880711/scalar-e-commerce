import { Error } from "mongoose";
import { ErrorDetailType, IValidationErrorDetail } from "../types";
export function generateErrorDetails(error: Error.ValidationError | null): IValidationErrorDetail[] {
    if (!error) {
        return [];
    }
    const errorDetails: IValidationErrorDetail[] = [];
    Object.keys(error.errors).forEach((key: string) => {
        errorDetails.push({
            type: ErrorDetailType.ValidationError,
            fieldPath: key,
            errors: [error.errors[key].message]
        });
    });

    return errorDetails;
}
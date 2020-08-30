import {CustomError} from "./custom-error";

export class BadRequestError extends CustomError{
    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    statusCode: number = 400;

    serializeErrors(): { message: string; field?: string }[] {
        return [{
            message: this.message
        }];
    }

}
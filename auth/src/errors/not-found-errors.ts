import {CustomError} from "./custom-error";

export class NotFoundErrors extends CustomError{
    statusCode: number = 404;

    constructor() {
        super('Route not found');
        Object.setPrototypeOf(this, NotFoundErrors.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return [{
            message: 'Not Found'
        }];
    }
}
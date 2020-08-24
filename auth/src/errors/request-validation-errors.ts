import {ValidationError} from "express-validator";
import {CustomError} from "./custom-error";

export class RequestValidationErrors extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request');
        //Only becasue we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationErrors.prototype);
    }

    serializeErrors(){
        return this.errors.map(err=> {
            return { message: err.msg, field: err.param };
        })
    }
}
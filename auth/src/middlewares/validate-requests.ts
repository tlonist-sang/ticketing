import {Request, Response, NextFunction} from 'express';
import {validationResult} from "express-validator";
import {RequestValidationErrors} from "../errors/request-validation-errors";

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new RequestValidationErrors(errors.array());
    }
    next();
}
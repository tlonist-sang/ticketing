import express, {Request, Response} from 'express'
import { body, validationResult } from 'express-validator';
import { RequestValidationErrors} from "../errors/request-validation-errors";
import { User } from "../models/user";
import {BadRequestError} from "../errors/bad-request-error";
import jwt from 'jsonwebtoken';
import {validateRequest} from "../middlewares/validate-requests";

const router = express.Router();

router.post('/api/users/signup',  [
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),
    body('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage("Password must be between 4 and 20 characters long")],
    validateRequest,
    async (req: Request, res: Response) => {
    //
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     throw new RequestValidationErrors(errors.array());
    // }
    const {email, password} = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser) {
        // console.log('Email in use');
        throw new BadRequestError('Email in use!!!');
    }

    const user = User.build({email, password});
    await user.save();

    //Generate Jsonwebtoken
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!);

    //store it in session
    req.session = {
        jwt: userJwt
    }

    return res.status(201).send(user);

});

export {router as signupRouter};
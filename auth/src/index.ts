import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler} from "./middlewares/error-handler";
import { NotFoundErrors } from "./errors/not-found-errors";
import mongoose from 'mongoose';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(errorHandler);

app.all('*', async (req, res) => {
    throw new NotFoundErrors();
});


const start = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    } catch(err) {
        console.log(err);
    }
    console.log('Connected to MongoDB!');

    app.listen(3000, ()=>{
        console.log('listening on port 3000!!!!!')
    });
};

start();



import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS{
        interface Global {
            signin():string[];
        }
    }
}

let mongo: any;
jest.mock('../nats-wrapper');
beforeAll(async () => {
    process.env.JWT_KEY = "changeit-test";
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async() => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async() => {
    await mongo.stop();
})

global.signin = () => {
    //Build a JWT payload {id, email}

    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }
    //Create a JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    //Build a session Object {jwt: MY_JWT}
    const session = {jwt: token};
    //Take JSON and encode it as base64
    const sessionJSON = JSON.stringify(session);
    //Return a string that's the cookie to be sent with the encoded data
    const base64 =  Buffer.from(sessionJSON).toString('base64');
    return [`express:sess=${base64}`];

}
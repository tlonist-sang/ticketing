import request from 'supertest';
import {app} from "../../app";

it('fails when an email does not exist is supplied', async()=> {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
})

it('fails when an incorrect password is input', async()=> {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test123.com',
            password: 'password'
        })
        .expect(201);
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test123.com',
            password: '1234asdf'
        })
        .expect(400);
})

it('succeeds when a correct password is input', async()=> {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test123.com',
            password: 'password'
        })
        .expect(201);
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test123.com',
            password: 'password'
        })
        .expect(200);
})
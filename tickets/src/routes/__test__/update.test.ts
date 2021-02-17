import request from 'supertest';
import {app} from "../../app";
import mongoose from 'mongoose';
import {Ticket} from '../../models/ticket';
import {natsWrapper} from "../../nats-wrapper";

it('returns 404 if the provided id does not exist', async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'helloworld',
            price: 20
        })
        .expect(404);
});

it('returns 401 if the user is not authenticated', async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'helloworld',
            price: 20
        })
        .expect(401);
});

it('returns 401 if the user does not own the ticket', async()=>{
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.signin())
        .send({
            title: 'random-title',
            price: 20
        });

    expect(response.body.title).toEqual('random-title');
    expect(response.body.price).toEqual(20);
    console.log("id=>", response.body.id);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'another-random-title',
            price: 21
        })
        .expect(401);
});

it('returns 400 if the user provides an invalid title or price', async()=>{
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'random-title',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: -10
        })
        .expect(400);
});

it('updates ticket when provided with valid inputs', async()=>{
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'random-title',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual(100);
});

it('publishes an event', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'random-title',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});


it('rejects update ticket when reserved', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'random-title',
            price: 20
        });

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({orderId: mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(400);
});
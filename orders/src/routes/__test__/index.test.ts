import request from 'supertest';
import {app} from "../../app";
import {Order} from "../../models/order";
import {Ticket} from "../../models/ticket";

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();
    return ticket;
}

it('fetches orders for a particualr user', async ()=>{
    // Create three tickets, save'em to database
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    // Create one order as user number #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId: ticketOne.id})
        .expect(201);

    // Create three orders as user #2
    const {body: OrderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketTwo.id})
        .expect(201);

    const {body: OrderTwo} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketThree.id})
        .expect(201);


    // Make request to get orders for User #2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    console.log(OrderOne);
    expect(response.body.length).toEqual(2);

    expect(response.body[0].id).toEqual(OrderOne.id);
    expect(response.body[1].id).toEqual(OrderTwo.id);
    // Make sure we only got the users for #2

    expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
    expect(response.body[1].ticket.id).toEqual(ticketThree.id)

})
import mongoose from 'mongoose';
import express, {Request, Response} from 'express';
import {NotFoundErrors, OrderStatus, requireAuth, validateRequest} from "@tlonist-sgtickets/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";
import {Order} from "../models/order";
import {BadRequestError} from "@tlonist-sgtickets/common";
import {natsWrapper} from "../nats-wrapper";
import {OrderCreatedPublisher} from "../events/publishers/order-created-publisher";


const EXPIRATION_WINDOW_SECONDS = 15 * 60;
const router = express.Router();

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketID must be provided')
], validateRequest, async (req: Request, res: Response) => {
    //find the ticket with specific ID
    const {ticketId} = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundErrors();
    }

    //make sure that the ticket is not reserved
    //run query to look at all orders. Find an order where the ticket is the ticket we just found and the order status is not cancelled
    const isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new BadRequestError('Ticket is already reserved!');
    }
    ;

    //make expiration condition
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //build an order and save it to database
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });

    await order.save();

    //publish an event saying that an order was created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    });
    res.status(201).send(order);
});

export {router as newOrderRouter};
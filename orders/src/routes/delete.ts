import express, {Request, Response} from 'express';
import {NotAuthorizedError, NotFoundErrors, requireAuth} from "@tlonist-sgtickets/common";
import {Order, OrderStatus} from "../models/order";

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async(req: Request, res: Response)=>{

    const {orderId} = req.params;
    const order = await Order.findById(orderId);

    if(!order){
      throw new NotFoundErrors();
    };

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    };

    order.status = OrderStatus.Cancelled;
    await order.save();

    //publish an event saying this is cancelled

    res.status(204).send(order);
});

export {router as deleteOrderRouter};
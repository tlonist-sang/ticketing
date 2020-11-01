import {Publisher, OrderCancelledEvent, Subjects} from "@tlonist-sgtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

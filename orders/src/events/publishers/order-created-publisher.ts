import {Publisher, OrderCreatedEvent, Subjects} from "@tlonist-sgtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

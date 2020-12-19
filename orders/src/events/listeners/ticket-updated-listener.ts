import {Message} from 'node-nats-streaming';
import {Listener, Subjects, TicketUpdatedEvent} from "@tlonist-sgtickets/common";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{

    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findByEvent(data);

        if(!ticket){
            throw new Error('Ticket not found');
        }

        const {title, price} = data; //can add data for customized version tracking (incrementing by 100, using timestamp etc..)
        ticket.set({title, price});
        await ticket.save();

        msg.ack();
    }

}
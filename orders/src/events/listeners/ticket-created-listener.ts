import {Message} from 'node-nats-streaming';
import {Subjects, Listener, TicketCreatedEvent} from "@tlonist-sgtickets/common";
import {Ticket} from "../../models/ticket";
import {queueGroupName} from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{

    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        //message can call ack (indicating successful handling of event
        const {id,title, price} = data;


        //make sure to have the same ID
        const ticket = Ticket.build({
            id,title, price
        });

        await ticket.save();
        msg.ack();
    }

}
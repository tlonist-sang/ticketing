import {Publisher, Subjects, TicketCreatedEvent} from "@tlonist-sgtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}
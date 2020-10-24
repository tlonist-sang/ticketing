import {Subjects, TicketUpdatedEvent, Publisher} from "@tlonist-sgtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
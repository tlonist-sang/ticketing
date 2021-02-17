import {ExpirationCompleteEvent, Publisher, Subjects} from "@tlonist-sgtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

}
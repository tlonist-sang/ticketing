import {Ticket} from "../ticket";

it('implements optismistic concurrency control', async(done)=>{
    //create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });

    //save the ticket to database
    await ticket.save();

    //fetch the ticket twice
    const first = await Ticket.findById(ticket.id);
    const second = await Ticket.findById(ticket.id);

    //make two separate changes to the tickets fetched
    first!.set({price: 10});
    second!.set({price: 15});

    //save the first fetched ticket
    await first!.save();

    //save the second fetched ticket (the prior action must have increased the version number), and expects an error.
    try{
        await second!.save();
    }catch(err){
        return done();
    }

    throw new Error('Should not throw this error!');
});

it('increments the version number on multiple saves', async()=>{
    const ticket = Ticket.build({
        title: 'concert',
        price: 12,
        userId: '12'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);

});
const EventTickets = artifacts.require("EventTickets");

contract("EventTickets", (accounts) => {
  let instance;
  const organizer = accounts[0];
  const controller = accounts[1];
  const buyer = accounts[2];
  const ticketPrice = web3.utils.toWei("0.001", "ether");
  const totalTickets = 100;

  // Deploy a fresh instance before each test
  beforeEach(async () => {
    instance = await EventTickets.new(ticketPrice, totalTickets, controller, { from: organizer });
  });

  it("should initialize with correct parameters", async () => {
    const contractOrganizer = await instance.organizer();
    const contractController = await instance.controller();
    const price = await instance.ticketPrice();
    const tickets = await instance.ticketsLeft();

    assert.equal(contractOrganizer, organizer, "Incorrect organizer");
    assert.equal(contractController, controller, "Incorrect controller");
    assert.equal(price, ticketPrice, "Incorrect ticket price");
    assert.equal(tickets, totalTickets, "Incorrect total tickets");
  });

  it("should allow a user to buy a ticket", async () => {
    await instance.buyTicket({ from: buyer, value: ticketPrice });

    const ticket = await instance.tickets(buyer);
    const ticketsRemaining = await instance.ticketsLeft();

    assert.equal(ticket.valid, true, "Ticket should be valid");
    assert.equal(ticket.used, false, "Ticket should not be used");
    assert.equal(ticketsRemaining, totalTickets - 1, "Tickets left should decrement");
  });

  it("should allow controller to validate a ticket", async () => {
    await instance.buyTicket({ from: buyer, value: ticketPrice });
    await instance.validateTicket(buyer, { from: controller });

    const ticket = await instance.tickets(buyer);
    assert.equal(ticket.used, true, "Ticket should be marked as used");
  });

  it("should not allow invalid ticket purchase", async () => {
    try {
      await instance.buyTicket({ from: buyer, value: web3.utils.toWei("0.0005", "ether") });
      assert.fail("Ticket purchase should fail for incorrect price");
    } catch (err) {
      assert(err.message.includes("Wrong price"), "Unexpected error message");
    }
  });

  it("should not allow duplicate ticket purchase", async () => {
    await instance.buyTicket({ from: buyer, value: ticketPrice });

    try {
      await instance.buyTicket({ from: buyer, value: ticketPrice });
      assert.fail("Ticket purchase should fail for duplicate buyer");
    } catch (err) {
      assert(err.message.includes("Already owns ticket"), "Unexpected error message");
    }
  });

  it("should allow organizer to withdraw funds", async () => {
    await instance.buyTicket({ from: buyer, value: ticketPrice });

    const initialBalance = BigInt(await web3.eth.getBalance(organizer));
    await instance.withdraw({ from: organizer });
    const finalBalance = BigInt(await web3.eth.getBalance(organizer));

    assert(finalBalance > initialBalance, "Organizer's balance should increase");
  });

  it("should not allow non-organizer to withdraw funds", async () => {
    try {
      await instance.withdraw({ from: buyer });
      assert.fail("Withdraw should fail for non-organizer");
    } catch (err) {
      assert(err.message.includes("Not organizer"), "Unexpected error message");
    }
  });
});

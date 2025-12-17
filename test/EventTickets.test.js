const EventTickets = artifacts.require("EventTickets");

contract("EventTickets", (accounts) => {
  let instance;

  // Test case 1: Deploy contract successfully
  it("should deploy the contract with valid constructor parameters", async () => {
    const ticketPrice = web3.utils.toWei("0.001", "ether");
    const totalTickets = 100;
    const controllerAddress = accounts[1];

    instance = await EventTickets.new(ticketPrice, totalTickets, controllerAddress);

    const organizer = await instance.organizer();
    const price = await instance.ticketPrice();
    const tickets = await instance.ticketsLeft();
    const controller = await instance.controller();

    assert.equal(organizer, accounts[0], "Organizer should be the account deploying the contract");
    assert.equal(price, ticketPrice, "Ticket price should match the constructor parameter");
    assert.equal(tickets, totalTickets, "Total tickets should match the constructor parameter");
    assert.equal(controller, controllerAddress, "Controller address should match the constructor parameter");
  });

  // Test case 2: Fail deployment if ticket price is zero
  it("should fail to deploy if ticket price is 0", async () => {
    try {
      await EventTickets.new(0, 100, accounts[1]);
      assert.fail("The deployment should have thrown an error");
    } catch (err) {
      assert(err.message.includes("Ticket price must be > 0"), `Unexpected error message: ${err.message}`);
    }
  });

  // Test case 3: Fail deployment if total tickets are zero
  it("should fail to deploy if total tickets is 0", async () => {
    try {
      await EventTickets.new(web3.utils.toWei("0.001", "ether"), 0, accounts[1]);
      assert.fail("The deployment should have thrown an error");
    } catch (err) {
      assert(err.message.includes("Number of tickets must be > 0"), `Unexpected error message: ${err.message}`);
    }
  });

  // Test case 4: Fail deployment if controller address is invalid
  it("should fail to deploy if controller address is zero", async () => {
    try {
      await EventTickets.new(web3.utils.toWei("0.001", "ether"), 100, "0x0000000000000000000000000000000000000000");
      assert.fail("The deployment should have thrown an error");
    } catch (err) {
      assert(err.message.includes("Controller cannot be zero address"), `Unexpected error message: ${err.message}`);
    }
  });

  // Test case 5: Check ticket purchase logic
  it("should allow user to buy a ticket", async () => {
    const ticketPrice = web3.utils.toWei("0.001", "ether");
    const totalTickets = 100;
    const controllerAddress = accounts[1];

    instance = await EventTickets.new(ticketPrice, totalTickets, controllerAddress);

    await instance.buyTicket({ from: accounts[2], value: ticketPrice });

    const ticket = await instance.tickets(accounts[2]);
    assert.equal(ticket.valid, true, "Ticket should be valid after purchase");
    assert.equal(ticket.used, false, "Ticket should not be used after purchase");

    const remainingTickets = await instance.ticketsLeft();
    assert.equal(remainingTickets, totalTickets - 1, "Remaining tickets should decrement by 1");
  });
});
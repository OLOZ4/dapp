const EventTickets = artifacts.require("EventTickets");

module.exports = async function (deployer, network, accounts) {
  const ticketPrice = web3.utils.toWei("0.00000000001", "ether"); // Price per ticket
  const totalTickets = 100; // Total tickets
  const controllerAddress = accounts[1]; // Second account as the controller

  console.log("Deploying EventTickets contract...");

  console.log("Deploying EventTickets contract...");
  console.log("Ticket Price:", ticketPrice);
  console.log("Total Tickets:", totalTickets);
  console.log("Controller Address:", controllerAddress);


  await deployer.deploy(EventTickets, ticketPrice, totalTickets, controllerAddress),{gas: 5000000};
  const deployedContract = await EventTickets.deployed();

  console.log("Deployed EventTickets at address:", deployedContract.address);
};
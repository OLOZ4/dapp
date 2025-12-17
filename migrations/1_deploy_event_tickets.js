const EventTickets = artifacts.require("EventTickets");

module.exports = async function (deployer, network, accounts) {
  // Parametrai kontrakto konstruktoriui
  const ticketPrice = web3.utils.toWei("0.000001", "ether"); // 0.1 ETH
  const totalTickets = 100; // Bilietų skaičius
  const controllerAddress = accounts[1]; // Antras account valdytojui

  console.log("Deploying EventTickets contract...");
  console.log("Ticket price (wei):", ticketPrice);
  console.log("Total tickets:", totalTickets);
  console.log("Controller address:", controllerAddress);

  await deployer.deploy(EventTickets, ticketPrice, totalTickets, controllerAddress, { gas: 5000000 })

  const deployed = await EventTickets.deployed();
  console.log("Contract deployed at address:", deployed.address);
};

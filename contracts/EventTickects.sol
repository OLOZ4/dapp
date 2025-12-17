// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EventTickets {
    address public organizer;
    address public controller;
    uint public ticketPrice;
    uint public ticketsLeft;

    struct Ticket {
        bool valid;
        bool used;
    }

    mapping(address => Ticket) public tickets;

    constructor(
    uint _price,
    uint _tickets,
    address _controller
) {
    organizer = msg.sender;
}

    // Function to buy a ticket
    function buyTicket() external payable {
        require(msg.value == ticketPrice, "Wrong price");
        require(ticketsLeft > 0, "Sold out");
        require(!tickets[msg.sender].valid, "Already owns ticket");

        ticketsLeft--;
        tickets[msg.sender] = Ticket(true, false);
    }

    // Function to validate the ticket
    function validateTicket(address _buyer) external {
        require(msg.sender == controller, "Not controller");
        require(tickets[_buyer].valid, "Invalid ticket");
        require(!tickets[_buyer].used, "Already used");

        tickets[_buyer].used = true;
    }

    // Organizer can withdraw funds
    function withdraw() external {
        require(msg.sender == organizer, "Not organizer");
        payable(organizer).transfer(address(this).balance);
    }
}
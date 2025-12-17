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
        // Validacija argumentų
        require(_price > 0, "Ticket price must be > 0");
        require(_tickets > 0, "Number of tickets must be > 0");
        require(_controller != address(0), "Controller cannot be zero address");

        organizer = msg.sender;
        ticketPrice = _price;
        ticketsLeft = _tickets;
        controller = _controller;
    }

    function buyTicket() external payable {
        require(msg.value == ticketPrice, "Wrong price");
        require(ticketsLeft > 0, "Sold out");
        require(!tickets[msg.sender].valid, "Already owns ticket");

        tickets[msg.sender] = Ticket(true, false);
        ticketsLeft--;
    }

    function validateTicket(address _buyer) external {
        require(msg.sender == controller, "Not controller");
        require(tickets[_buyer].valid, "Invalid ticket");
        require(!tickets[_buyer].used, "Already used");

        tickets[_buyer].used = true;
    }

    function withdraw() external {
        require(msg.sender == organizer, "Not organizer");
        payable(organizer).transfer(address(this).balance);
    }
}

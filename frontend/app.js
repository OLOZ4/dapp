const contractABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tickets",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_controller",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "controller",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "organizer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "ticketPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tickets",
      "outputs": [
        {
          "internalType": "bool",
          "name": "valid",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "used",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "ticketsLeft",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "buyTicket",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_buyer",
          "type": "address"
        }
      ],
      "name": "validateTicket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
const contractAddress = "0x93eaab2539260d3cE3F9E9F054Fa245fda2c1bF4"; // Replace with your contract address

let web3;
let contract;
let userAccount;

window.onload = async () => {
  document.getElementById("connectWallet").addEventListener("click", connectWallet);
  document.getElementById("buyTicket").addEventListener("click", buyTicket);
  document.getElementById("validateTicket").addEventListener("click", validateTicket);
  document.getElementById("withdrawFunds").addEventListener("click", withdrawFunds);
};

const connectWallet = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      userAccount = accounts[0];
      alert(`Connected: ${userAccount}`);
      initContract();
    } catch (e) {
      alert("User denied connection");
    }
  } else {
    alert("Please install MetaMask!");
  }
};

const initContract = async () => {
  contract = new web3.eth.Contract(contractABI, contractAddress);
  const price = await contract.methods.ticketPrice().call();
  const remainingTickets = await contract.methods.ticketsLeft().call();
  document.getElementById("ticketPrice").innerText = web3.utils.fromWei(price, "ether");
  document.getElementById("ticketsLeft").innerText = remainingTickets;
};

const buyTicket = async () => {
  if (!contract) return alert("Connect your wallet first!");
  const price = await contract.methods.ticketPrice().call();
  try {
    await contract.methods.buyTicket().send({ from: userAccount, value: price });
    alert("Ticket purchased!");
    const remainingTickets = await contract.methods.ticketsLeft().call();
    document.getElementById("ticketsLeft").innerText = remainingTickets;
  } catch (e) {
    alert("Error purchasing ticket: " + e.message);
  }
};

const validateTicket = async () => {
  if (!contract) return alert("Connect your wallet first!");
  const ticketHolder = document.getElementById("ticketHolder").value;
  try {
    await contract.methods.validateTicket(ticketHolder).send({ from: userAccount });
    alert("Ticket validated!");
  } catch (e) {
    alert("Error validating ticket: " + e.message);
  }
};

const withdrawFunds = async () => {
  if (!contract) return alert("Connect your wallet first!");
  try {
    await contract.methods.withdraw().send({ from: userAccount });
    alert("Funds withdrawn to organizer!");
  } catch (e) {
    alert("Error withdrawing funds: " + e.message);
  }
};

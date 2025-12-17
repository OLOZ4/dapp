import artifact from "../build/contracts/EventTickets.json";

let provider, signer, contract;

async function connect() {
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  const network = await provider.getNetwork();
  const address = artifact.networks[network.chainId].address;

  contract = new ethers.Contract(address, artifact.abi, signer);
}

async function buy() {
  const price = await contract.ticketPrice();
  await contract.buyTicket({ value: price });
}

async function validate() {
  const user = prompt("User address:");
  await contract.validateTicket(user);
}

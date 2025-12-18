module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Ganache host
      port: 8545,        // Ganache port
      network_id: 5777,   // Match any network id
      gas: 6721975,      // Increase the gas limit
      gasPrice: 20000000000, // 20 Gwei
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",
    },
  },
};
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Ganache host
      port: 8545,        // Ganache port
      network_id: "*",   // Match any network id
      gas: 8000000,      // Increase the gas limit
      gasPrice: 20000000000, // 20 Gwei
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",
    },
  },
};
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Ganache GUI arba CLI localhost
      port: 8545,            // Ganache GUI default port
      network_id: "*",       // tinka bet koks network id
      gas: 6721975,          // gas limit
      gasPrice: 20000000000
    }
  },
  compilers: {
    solc: {
      version: "0.8.20"
    }
  }
};

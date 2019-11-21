module.exports = {
  networks: {
    develop: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 6721975, // Truffle default development block gas limit
      gasPrice: 200000000000,
      solc: {
        version: "0.5.0",
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};

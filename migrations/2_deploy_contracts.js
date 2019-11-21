require("babel-polyfill");

const CharitySplitter = artifacts.require("./CharitySplitter.sol");

module.exports = function(deployer, network, accounts) {
  const owner = accounts[1];

  return deployer.then(() => {
    return deployer.deploy(CharitySplitter, owner);
  });
};

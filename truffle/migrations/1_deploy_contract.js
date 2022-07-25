const SimpleStorage = artifacts.require("SimpleStorage");
const Staking = artifacts.require("Staking");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Staking);
};

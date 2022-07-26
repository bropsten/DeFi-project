const RewardToken = artifacts.require("RewardToken");
const Staking = artifacts.require("Staking");

module.exports = function (deployer) {
  deployer.deploy(RewardToken);
  deployer.deploy(Staking, RewardToken.address,RewardToken.address);
};


// module.exports = function (deployer) {
//   deployer.deploy(SimpleStorage, value_01, value_02);
// };
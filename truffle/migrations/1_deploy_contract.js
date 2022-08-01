const RewardToken = artifacts.require("BROToken");
const Staking = artifacts.require("Staking");

module.exports = async function (deployer) {
  await deployer.deploy(RewardToken);
  await deployer.deploy(Staking, RewardToken.address, RewardToken.address);
};


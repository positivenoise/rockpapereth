var RockPaperEth = artifacts.require("RockPaperEth");

module.exports = function(deployer) {
  deployer.deploy(RockPaperEth);
};
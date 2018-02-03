var Migrations = artifacts.require("./Migrations.sol");
var AvoCrowdSale = artifacts.require("./AvoCrowdSale.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(AvoCrowdSale);
};

var Migrations = artifacts.require("./Migrations.sol");
var AvoCrowdsale = artifacts.require("./AvoCrowdsale.sol");

// TODO
//  - Better use toWei

module.exports = (deployer, network, accounts) => {
  deployer.deploy(Migrations);
  
  console.log(`

                                        888             d8b         
                                        888             Y8P         
                                        888                         
 .d88b. 888  888 8888b.  .d8888b .d8888b88888b.  8888b. 88888888b.  
d88P"88b888  888    "88bd88P"   d88P"   888 "88b    "88b888888 "88b 
888  888888  888.d888888888     888     888  888.d888888888888  888 
Y88b 888Y88b 888888  888Y88b.   Y88b.   888  888888  888888888  888 
 "Y88888 "Y88888"Y888888 "Y8888P "Y8888P888  888"Y888888888888  888 
     888                                                            
Y8b d88P                                                            
 "Y88P"                                                             
`);

  let d = new Date();
  let start = d.getTime()+10;
  let end = d.getTime()+300;
  
  console.log("Start is", start, "\nEnd is  ", end, "\n");

  const userAddress = accounts[0];
  deployer.deploy(
    AvoCrowdsale,
    start, end,                    // start and end time
    10,                            // rate (units per wei)
    web3.toWei(1, "ether"),        // crowdsale goal
    web3.toWei(125000, "ether"),   // crowdsale cap
    userAddress                    // fund collection wallet $$$
  );
}

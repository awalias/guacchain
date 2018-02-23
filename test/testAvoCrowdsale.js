//const expectedExceptionPromise = require("../utils/expectedException.js");
//web3.eth.getTransactionReceiptMined = require("../utils/getTransactionReceiptMined.js");
//Promise.allNamed = require("../utils/sequentialPromiseNamed.js");
//const isAddress = require("../utils/isAddress.js");

const AvoCrowdsale = artifacts.require("./AvoCrowdsale.sol");
const AvoToken = artifacts.require("./AvoToken.sol");

contract('AvoCrowdsale', function(accounts) {
    let accs = accounts;
    let owner = accs[0];
    let investor1 = accs[1];
    let investor2 = accs[1];

    let d = new Date();
    let start = Math.round((new Date()).valueOf()/1000);
    let end = start+300;
    let rate = 100;

    let crowdsale;
    const addressZero = "0x0000000000000000000000000000000000000000";
    const deposit0 = Math.floor(Math.random() * 1000) + 1;

    before("should prepare", function() {
	assert.isAtLeast(accs.length, 3);
    });

    beforeEach("should deploy a new crowdsale", function() {
	return AvoCrowdsale.new(
	    start, end,
	    rate,                          // rate (units per wei)
	    web3.toWei(1, "ether"),        // crowdsale goal
	    web3.toWei(125000, "ether"),   // crowdsale cap
	    owner,                         // fund collection wallet $$$
	    { from: owner }
	).then(instance => crowdsale = instance);
    });

    describe("standard interaction", function() {
	it("Avotoken test", function() {
	    return AvoToken.new();
	});
	
        it("Investor1 buys tokens", async function() {
	    await AvoToken.new();
	    
	    await crowdsale.buyTokens(
		investor1,
		{from: investor1, value: web3.toWei(1.23, "ether")}
	    );

	    let raised = await crowdsale.weiRaised.call();
	    assert.strictEqual(raised.toString(), web3.toWei(1.23, "ether").toString());
	});
    });

});

//const expectedExceptionPromise = require("../utils/expectedException.js");
//web3.eth.getTransactionReceiptMined = require("../utils/getTransactionReceiptMined.js");
//Promise.allNamed = require("../utils/sequentialPromiseNamed.js");
//const isAddress = require("../utils/isAddress.js");

const AvoCrowdsale = artifacts.require("./AvoCrowdsale.sol");
const AvoToken = artifacts.require("./AvoToken.sol");
const timeout = ms => new Promise(res => setTimeout(res, ms))

contract('AvoCrowdsale', function(accounts) {
    let accs = accounts;
    let owner = accs[0];
    let investor1 = accs[1];
    let investor2 = accs[2];

    let d = new Date();
    let start = Math.round((new Date()).valueOf()/1000);
    let end = start+300;
    let rate = 100;

    let crowdsale;
    let token;
    
    const addressZero = "0x0000000000000000000000000000000000000000";
    const deposit0 = Math.floor(Math.random() * 1000) + 1;

    before("should prepare", function() {
	assert.isAtLeast(accs.length, 3);
    });

    describe("Crowdsale", function() {
	beforeEach("should deploy new crowdsale", function() {
	    return AvoCrowdsale.new(
		start, end,
		rate,                          // rate (units per wei)
		web3.toWei(1, "ether"),        // crowdsale goal
		web3.toWei(125000, "ether"),   // crowdsale cap
		owner,                         // fund collection wallet $$$
		{ from: owner }
	    ).then(async instance => {
		crowdsale = instance;
		token = AvoToken.at(await crowdsale.token.call());
	    });
	});

	it("should create AvoToken", function() {
	    return AvoToken.new();
	});
	
        it("should process token purchase of Investor1", async function() {	    
	    await crowdsale.buyTokens(
		investor1,
		{from: investor1, value: web3.toWei(0.23, "ether")}
	    );

	    let raised = await crowdsale.weiRaised.call();
	    let balance1 = await token.balanceOf.call(investor1);
	    let goalReached = await crowdsale.goalReached.call();
	    
	    assert.strictEqual(raised.toString(), web3.toWei(0.23, "ether").toString());
	    assert.strictEqual(balance1.toString(), web3.toWei(0.23*rate, "ether").toString());
	    assert.equal(goalReached, false);
	});
	
        it("should process token purchase of Investor1 and Investor2", async function() {	    
	    await crowdsale.buyTokens(
		investor1,
		{from: investor1, value: web3.toWei(0.23, "ether")}
	    );
	    await crowdsale.buyTokens(
		investor2,
		{from: investor2, value: web3.toWei(1.23, "ether")}
	    );

	    let raised = await crowdsale.weiRaised.call();
	    let balance1 = await token.balanceOf.call(investor1);
	    let balance2 = await token.balanceOf.call(investor2);
	    let goalReached = await crowdsale.goalReached.call();
	    
	    assert.strictEqual(raised.toString(), web3.toWei(1.46, "ether").toString());
	    assert.strictEqual(balance1.toString(), web3.toWei(0.23*rate, "ether").toString());
	    assert.strictEqual(balance2.toString(), web3.toWei(1.23*rate, "ether").toString());
	    assert.equal(goalReached, true);
	});	
    });

    describe("Investors", function() {
	beforeEach("should start crowdsale with investors", async function() {
	    crowdsale = await AvoCrowdsale.new(
		start, end,
		rate,                          // rate (units per wei)
		web3.toWei(1, "ether"),        // crowdsale goal
		web3.toWei(125000, "ether"),   // crowdsale cap
		owner,                         // fund collection wallet $$$
		{ from: owner }
	    )

	    token = AvoToken.at(await crowdsale.token.call());

	    await crowdsale.buyTokens(
		investor1,
		{from: investor1, value: web3.toWei(0.23, "ether")}
	    );
	    await crowdsale.buyTokens(
		investor2,
		{from: investor2, value: web3.toWei(1.23, "ether")}
	    );
	});
	
	it("should update lastMoved", async function() {
	    let beforeLastMovedInvestor1 = await token.getLastMoved(investor1);
	    let beforeLastMovedInvestor2 = await token.getLastMoved(investor2);
	    assert.strictEqual(beforeLastMovedInvestor1.toString(), "0");
	    assert.strictEqual(beforeLastMovedInvestor2.toString(), "0");
	    await timeout(1000);
	    
	    await token.transfer(investor2, web3.toWei(0.22*rate, "ether"), {from: investor1});
	    let balance1 = await token.balanceOf.call(investor1);
	    let balance2 = await token.balanceOf.call(investor2);
	    let afterLastMovedInvestor1 = await token.getLastMoved(investor1);
	    let afterLastMovedInvestor2 = await token.getLastMoved(investor2);
	    console.log(balance1.toString());
	    console.log(balance2.toString());
	    
	    assert.strictEqual(balance1.toNumber(), web3.toWei(0.01*rate, "ether")-42);
	    assert.strictEqual(balance2.toString(), web3.toWei(1.45*rate, "ether").toString());

	    assert.isAbove(afterLastMovedInvestor1.toNumber(), beforeLastMovedInvestor1.toNumber());
	    assert.isAbove(afterLastMovedInvestor2.toNumber(), beforeLastMovedInvestor2.toNumber());
	    assert.equal(afterLastMovedInvestor1.toNumber(), afterLastMovedInvestor2.toNumber());

	});	
    });
});

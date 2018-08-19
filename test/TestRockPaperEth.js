const RockPaperEth = artifacts.require("RockPaperEth");

const ETHER = 10**18;

contract("RockPaperEth", accounts => {
  const [firstAccount, secondAccount, thirdAccount, fourthAccount] = accounts;

  let rockpapereth

  beforeEach('setup contract for each test', async function () {
      rockpapereth = await RockPaperEth.new()
  })

  it("sets an owner", async () => {
    //ensures the owner is correctly set
    assert.equal(await rockpapereth.owner.call(), firstAccount);
  });

  it("not paused", async () => {
    //makes sure the contract isnt paused on creation
    assert.equal(await rockpapereth.paused.call(), false);
  });

  it("is pausable by owner", async () => {
    //ensures owner can pause
    await rockpapereth.pause({ from: firstAccount });
    assert.equal(await rockpapereth.paused.call(), true);
  });

  it("is unpausable by owner", async () => {
    //ensures owner can unpause
    await rockpapereth.pause({ from: firstAccount });
    assert.equal(await rockpapereth.paused.call(), true);
    await rockpapereth.unpause({ from: firstAccount });
    assert.equal(await rockpapereth.paused.call(), false);
  });

  it("is only pausable by owner", async () => {
    //ensures only owner can pause
    try {
      await rockpapereth.pause({ from: secondAccount });
      assert.fail();
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
  });

  it("is only DESTROY-ABLE by owner", async () => {
    //ensures only owner can pause
    try {
      await rockpapereth.destroy({ from: secondAccount });
      assert.fail();
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
  });

  it("is only unpausable by owner", async () => {
    //ensures only owner can unpause
    await rockpapereth.pause({ from: firstAccount });
    assert.equal(await rockpapereth.paused.call(), true);
    try {
      await rockpapereth.unpause({ from: secondAccount });
      assert.fail();
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
  });
  
  it("allows registration", async () => {
    //checks registration returns true for both accounts
    assert.ok(await rockpapereth.register.call({ from: secondAccount, value: 0.1 * ETHER}));
    assert.ok(await rockpapereth.register.call({ from: thirdAccount, value: 0.1 * ETHER}));
  });

  it("only allows 2 registrations", async () => {
    //checks registration returns false for the third account
    await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
    await rockpapereth.register({ from: thirdAccount, value: 0.1 * ETHER});
    assert.equal(await rockpapereth.register.call({ from: fourthAccount, value: 0.1 * ETHER}), false);
  });

  it("doesn't allow same address for both registrations", async () => {
    //ensures user can't play with themselves
    try {
      await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
      await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
      assert.fail();
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
  });

  it("only allows 0.1 eth to be sent with register", async () => {
    //makes sure value is set at 0.1 eth
    try {
      await rockpapereth.register({ from: secondAccount, value: 0.11 * ETHER});
      assert.fail();
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
    try {
      await rockpapereth.register({ from: secondAccount, value: 0.09 * ETHER});
      assert.fail();
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
    
  });

  it("returns addresses correctly", async () => {
    //checks the addresses and returns for player addresses
    await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
    await rockpapereth.register({ from: thirdAccount, value: 0.1 * ETHER});
    assert.equal(await rockpapereth.player1.call(), secondAccount);
    assert.equal(await rockpapereth.player2.call(), thirdAccount);
    assert.equal(await rockpapereth.whoIsPlayer1.call(), secondAccount);
    assert.equal(await rockpapereth.whoIsPlayer2.call(), thirdAccount);
  });

  it("deposits funds correctly", async () => {
    //makes sure funds are deposited when both players register
    const initBalance = rockpapereth.getContractBalance();
    await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
    await rockpapereth.register({ from: thirdAccount, value: 0.1 * ETHER});
    const finalBalance = rockpapereth.getContractBalance();
    assert.notEqual(finalBalance,initBalance); //Makes sure initBalance has changed 
  });

  it("allows encrypting", async () => {
    //makes sure the encrypt function returns true and both players can submit hands
    await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
    await rockpapereth.register({ from: thirdAccount, value: 0.1 * ETHER});
    assert.ok(await rockpapereth.encrypt.call("rock","secret", { from: secondAccount }));
    assert.ok(await rockpapereth.encrypt.call("paper","password", { from: thirdAccount }));
  });

  it("validates strings correctly", async () => {
    //checks string validation. Or validates strings correctly.
    await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
    try {
      await rockpapereth.encrypt("banana","secret", { from: secondAccount });
      assert.fail();
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
  });

  it("allows decrypting", async () => {
    //checks the decrypt function works for player hands when same answer submitted
    await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
    await rockpapereth.register({ from: thirdAccount, value: 0.1 * ETHER});
    await rockpapereth.encrypt("rock","secret", { from: secondAccount });
    await rockpapereth.encrypt("paper","password", { from: thirdAccount });
    assert.ok(await rockpapereth.decrypt.call("rock","secret", { from: secondAccount }));
    assert.ok(await rockpapereth.decrypt.call("paper","password", { from: thirdAccount }));
  });

  it("correctly returns winner", async () => {
    //checks winner is returned when game is finished
    await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
    await rockpapereth.register({ from: thirdAccount, value: 0.1 * ETHER});
    await rockpapereth.encrypt("rock","secret", { from: secondAccount });
    await rockpapereth.encrypt("paper","password", { from: thirdAccount });
    await rockpapereth.decrypt("rock","secret", { from: secondAccount });
    await rockpapereth.decrypt("paper","password", { from: thirdAccount });
    assert.equal(await rockpapereth.finish.call({ from: secondAccount }), 2);
  });

  it("resets needed variables", async () => {
    //makes sure variables are reset at the end of the game
    await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
    await rockpapereth.register({ from: thirdAccount, value: 0.1 * ETHER});
    await rockpapereth.encrypt("rock","secret", { from: secondAccount });
    await rockpapereth.encrypt("paper","password", { from: thirdAccount });
    await rockpapereth.decrypt("rock","secret", { from: secondAccount });
    await rockpapereth.decrypt("paper","password", { from: thirdAccount });
    await rockpapereth.finish({ from: secondAccount });
    assert.equal(await rockpapereth.player1.call(), 0);
    assert.equal(await rockpapereth.player2.call(), 0);
    assert.equal(await rockpapereth.player1Hand.call(), 0);
    assert.equal(await rockpapereth.player2Hand.call(), 0);
  });

  it("correctly pays out winner", async () => {
    //checks the winner is paid out
    const initBalance = web3.eth.getBalance(thirdAccount);
    await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
    await rockpapereth.register({ from: thirdAccount, value: 0.1 * ETHER});
    await rockpapereth.encrypt("rock","secret", { from: secondAccount });
    await rockpapereth.encrypt("paper","password", { from: thirdAccount });
    await rockpapereth.decrypt("rock","secret", { from: secondAccount });
    await rockpapereth.decrypt("paper","password", { from: thirdAccount });
    await rockpapereth.finish({ from: secondAccount });
    const finalBalance = web3.eth.getBalance(thirdAccount);
    assert.ok(finalBalance.greaterThan(initBalance)); //hard to tell with gas usage but w/e
  });

  it("correctly reports player phases", async () => {
    //checks the whatPhaseAmI for all 3 phases and finish
    assert.equal(await rockpapereth.whatPhaseAmI({ from: secondAccount }), 0);
    assert.equal(await rockpapereth.whatPhaseAmI({ from: thirdAccount }), 0);
    await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
    await rockpapereth.register({ from: thirdAccount, value: 0.1 * ETHER});
    assert.equal(await rockpapereth.whatPhaseAmI({ from: secondAccount }), 1);
    assert.equal(await rockpapereth.whatPhaseAmI({ from: thirdAccount }), 1);
    await rockpapereth.encrypt("rock","secret", { from: secondAccount });
    await rockpapereth.encrypt("paper","password", { from: thirdAccount });
    assert.equal(await rockpapereth.whatPhaseAmI({ from: secondAccount }), 2);
    assert.equal(await rockpapereth.whatPhaseAmI({ from: thirdAccount }), 2);
    await rockpapereth.decrypt("rock","secret", { from: secondAccount });
    await rockpapereth.decrypt("paper","password", { from: thirdAccount });
    assert.equal(await rockpapereth.whatPhaseAmI({ from: secondAccount }), 3);
    assert.equal(await rockpapereth.whatPhaseAmI({ from: thirdAccount }), 3);
    await rockpapereth.finish({ from: secondAccount });
    assert.equal(await rockpapereth.whatPhaseAmI({ from: secondAccount }), 0);
    assert.equal(await rockpapereth.whatPhaseAmI({ from: thirdAccount }), 0);
   });

   it("correctly reports global phases", async () => {
     //checks the whatPhaseIsIt for all 3 phases
    assert.equal(await rockpapereth.whatPhaseIsIt(), 0);
    await rockpapereth.register({ from: secondAccount, value: 0.1 * ETHER});
    await rockpapereth.register({ from: thirdAccount, value: 0.1 * ETHER});
    assert.equal(await rockpapereth.whatPhaseIsIt(), 1);
    await rockpapereth.encrypt("rock","secret", { from: secondAccount });
    await rockpapereth.encrypt("paper","password", { from: thirdAccount });
    assert.equal(await rockpapereth.whatPhaseIsIt(), 2);
    await rockpapereth.decrypt("rock","secret", { from: secondAccount });
    await rockpapereth.decrypt("paper","password", { from: thirdAccount });
    assert.equal(await rockpapereth.whatPhaseIsIt(), 3);
    await rockpapereth.finish({ from: secondAccount });
    assert.equal(await rockpapereth.whatPhaseIsIt(), 0);
   });
});
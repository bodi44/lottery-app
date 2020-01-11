const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

describe('Lottery contract', () => {
  let accounts;
  let lottery;
  beforeEach(async () => {
    // Given
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
      .deploy({ data: `0x${evm.bytecode.object}` })
      .send({ from: accounts[0], gas: 1000000 });
  });

  it('deploys contract', () => {
    // When
    // Then
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    // Given
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    });

    // When
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    // Then
    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  it('allows multiple accounts to enter', async () => {
    // Given
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether'),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether'),
    });

    // When
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    // Then
    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });

  it('requires a minimum amount of ether to enter', async () => {
    try {
      // When
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.001', 'ether'),
      });
      // Then
      assert(false);
    } catch (e) {
      // When
      // Then
      assert(e);
    }
  });

  it('only manager can call pickWinner', async () => {
    try {
      // When
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
      // Then
      assert(false);
    } catch (e) {
      // When
      // Then
      assert(e);
    }
  });

  it('send money to winner and reset the players array', async () => {
    // When
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    });
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });

    //Then
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei('1.8', 'ether'));
  });
});

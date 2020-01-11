const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

const mnemonic =
  'trick okay text rifle enlist praise disagree cupboard north border fringe radar';
const provider = new HDWalletProvider(
  mnemonic,
  'https://rinkeby.infura.io/v3/e3db0a1cb9d94466941c23f76b7a6141'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`Deploying from account ${accounts[0]}`);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: `0x${evm.bytecode.object}` })
    .send({ from: accounts[0], gas: 1000000 });

  console.log(abi);
  console.log(`Contract deployed ${result.options.address}`);
};

deploy();

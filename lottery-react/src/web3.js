import Web3 from 'web3';

const checkProviders = () => {
  if (window.ethereum) {
    window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    return web3;
  } else if (window.web3) {
    const web3 = new Web3(window.web3.currentProvider);
    return web3;
  }
};
//
// // window.web3 = new Web3(web3.currentProvider);
const web3 = checkProviders();
//
// // console.log(web3.then(res => console.log(res)));
//
export default web3;

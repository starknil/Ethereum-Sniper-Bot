const { Web3 } = require('web3');
const infuraId = "a344e30144bf4321bf79328d575c50b4";
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + infuraId));

module.exports = {
  Web3,
  web3
}
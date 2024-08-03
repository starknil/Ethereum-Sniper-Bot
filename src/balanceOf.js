const { web3 } = require('./web3');
const fetchAbi = require('./fetchAbi');


const balanceOf = async (tokenAddress,address) => {
  try {
     const abi = await fetchAbi(tokenAddress);
     const contract = new web3.eth.Contract(JSON.parse(abi), tokenAddress);
    const balance = await contract.methods.balanceOf(address).call();
    return balance;
  } catch (e) {
     return false;
  }
  
}


module.exports = balanceOf;
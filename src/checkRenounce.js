const { web3 } = require('./web3');
const fetchAbi = require('./fetchAbi');

const checkRenounce = async (address) => {
    try {
      const abi = await fetchAbi(address);
      if (!abi){
        return false;
      }
      const contract = new web3.eth.Contract(JSON.parse(abi), address);
      const isRenounced = await contract.methods.owner().call();
      return isRenounced === "0x0000000000000000000000000000000000000000";
    } catch (error) {
        console.error('Error fetching renounced details:', error);
      return false;
    }
}

module.exports = checkRenounce;
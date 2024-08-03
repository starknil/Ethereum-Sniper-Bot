const axios = require('axios');
const ETHERSCAN_API_KEY = "82VTZJ45AFCQKDBII4XNFM894JQSRG4R44";

const fetchAbi = async (contractAddress) => {
  const baseUrl = 'https://api.etherscan.io/api';
  const params = {
    module: 'contract',
    action: 'getabi',
    address: contractAddress,
    apikey: ETHERSCAN_API_KEY,
  };
  try {
    const response = await axios.get(baseUrl, { params });
    if (response.data.status === '1') {
      return response.data.result;
    }else{
      return false;
    }
  } catch (error) {
    console.error('Error fetching ABI:', error);
  }
    return false; 
}

module.exports = fetchAbi;
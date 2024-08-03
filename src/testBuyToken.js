const axios = require("axios");

async function httpCall() {

  const url = "https://api.1inch.dev/fusion/quoter/v5.0/1/quote";

  const data = {
    fromTokenAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", 
    toTokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f", 
    amount: "1000000000000000000" // 1 WETH (18 decimals)
  };

  const config = {
    headers: {
      "Authorization": "Bearer G9AnMYBCc15vzNs7MkXVqvXnDO62OvS1" 
    }
  };

  try {
    const response = await axios.get(url, data, config);
    console.log(response);
  } catch (error) {
    console.error(error.response.data); 
  }
}

module.exports = httpCall;



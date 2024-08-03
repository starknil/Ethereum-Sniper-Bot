const axios = require('axios');

const getPrice = async (coin = "ETH") => {
  try {
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=USD`;
    const response = await axios.get(url);
    const price = response.data.USD;
    return price;
  }catch (err) {
    console.log(err);
    return 0;
  }
};

module.exports = getPrice;
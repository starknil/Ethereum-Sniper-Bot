const axios = require('axios');
const sendMessage = require('./sendMessage');
const admin = 5626151907;
const topHolders = async (tokenAddress,limit) => {
    try {
      const options = {
        url: `https://api.chainbase.online/v1/token/top-holders?chain_id=1&contract_address=${tokenAddress}&page=1&limit=${limit}`,
        method: 'GET',
        headers: {
          'x-api-key': '2jvLmBQ2oaTo5MTlZt7qYy2oAnE',
          'accept': 'application/json'
        }
      };
        let res = await axios(options);
        res = res.data;

        if (res.data && res.data.length > 0){
  /*         let txt = "💰 <b><u>Top 5 holders</u></b>\n\n";
            let count = 1;
           for (const holders of res.data){

               txt += `
${count}. Address: <a href="https://etherscan.io/address/${holders.wallet_address}">${holders.wallet_address}</a>
💸 Holding: ${holders.amount} ~ ${holders.usd_value} USD
`;
                count++;
            }
            await sendMessage(admin, txt);*/
            return res.data;
        }else{
            return false;
        }
    }catch (e){
        console.log(`Error fetching top holders: ${e}`);
        return false;
    }
};

module.exports = topHolders;
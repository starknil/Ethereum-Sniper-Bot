const axios = require('axios');
const sendMessage = require('./sendMessage');
const channel = "sniperdemochannel";

const pairDetails = async (tokenAddress) => {
  try {
     const res = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);

    let pair = res.data.pairs;
        if (!pair || !pair[0]){
          console.log("No paired token found");
          return false;
        }
 /*       pair = pair[0];
        const baseToken = pair.baseToken;
        const quoteToken = pair.quoteToken;
        const liquidity = pair.liquidity.usd
        const socials = pair.info || [];
        const image = socials.imageUrl;
        const website = socials.websites || [];
        const social = socials.socials || [];

        let webs = `<a href="${pair.url}">🌐 DEXSREENER</a> || `;
        for (const web of website){

          webs += `🔗 <a href="${web.url}">${web.label.toUpperCase()}</a> || `;

        }

        for (const soc of social){
          webs += `🔗 <a href="${soc.url}">${soc.type.toUpperCase()}</a> || `;
        }
        const details = `
<b>📊 New Token Pair Detected</b>

<b>🔗 Pair Address:</b> <a href="${pair.url}">${pair.pairAddress}</a>
<b>🪙 Base Token:</b> ${baseToken.name} (${baseToken.symbol})
<b>🪙 Quote Token:</b> ${quoteToken.name} (${quoteToken.symbol})
<b>💵 Price (Native):</b> ${pair.priceNative}
<b>💵 Price (USD):</b> ${pair.priceUsd}

<b>📈 Transactions (Last 5 mins):</b>
  - Buys: ${pair.txns.m5.buys}
  - Sells: ${pair.txns.m5.sells}
<b>📈 Transactions (Last 1 hr):</b>
  - Buys: ${pair.txns.h1.buys}
  - Sells: ${pair.txns.h1.sells}
<b>📈 Transactions (Last 6 hrs):</b>
  - Buys: ${pair.txns.h6.buys}
  - Sells: ${pair.txns.h6.sells}
<b>📈 Transactions (Last 24 hrs):</b>
  - Buys: ${pair.txns.h24.buys}
  - Sells: ${pair.txns.h24.sells}

<b>🔄 Price Change:</b>
  - Last 5 mins: ${pair.priceChange.m5}%
  - Last 1 hr: ${pair.priceChange.h1}%
  - Last 6 hrs: ${pair.priceChange.h6}%
  - Last 24 hrs: ${pair.priceChange.h24}%

<b>💸 Volume (USD):</b>
  - Last 5 mins: ${pair.volume.m5}
  - Last 1 hr: ${pair.volume.h1}
  - Last 6 hrs: ${pair.volume.h6}
  - Last 24 hrs: ${pair.volume.h24}

<b>💧 Liquidity:</b>
  - USD: ${liquidity}
  - Base: ${pair.liquidity.base}
  - Quote: ${pair.liquidity.quote}

<b>📅 Pair Created At:</b> ${new Date(pair.pairCreatedAt).toLocaleString()}

    ${webs}
    `;
        sendMessage("@"+channel, details);
*/

    return pair[0];
  } catch (err) {
     console.log(`Error fetching token details: ${err}`);
    return false;
  }
};

module.exports = pairDetails;
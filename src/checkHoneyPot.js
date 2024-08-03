let honeyPot = require('@normalizex/honeypot-is');
honeyPot = new honeyPot.HoneypotIsV1
const sendMessage = require('./sendMessage');
const channel = "sniperdemochannel";

async function checkHoneypot(tokenAddress) {
  try {
    const result = await honeyPot.honeypotScan(tokenAddress);
    if (!result){
      return false;
    }
    const tokenInfo = result;
/*    const message = `
📊 <b>Token Analysis Report</b>

<b>Token Name:</b> ${tokenInfo.Token.Name} 🚀
<b>Token Symbol:</b> ${tokenInfo.Token.Symbol} 🏷️
<b>Token Decimals:</b> ${tokenInfo.Token.Decimals} 🔢
<b>Token Address:</b> <a href="https://etherscan.io/token/${tokenInfo.Token.Address}">${tokenInfo.Token.Address}</a> 🔗

<b>Paired with:</b> ${tokenInfo.WithToken.Name} (${tokenInfo.WithToken.Symbol}) 🤝
<b>Paired Token Address:</b> <a href="https://etherscan.io/token/${tokenInfo.WithToken.Address}">${tokenInfo.WithToken.Address}</a> 🔗

<b>Is Honeypot:</b> ${tokenInfo.IsHoneypot ? 'Yes ⚠️' : 'No ✅'}

💸 <b>TAX:</b> BUY: ${tokenInfo.BuyTax}% | SELL: ${tokenInfo.SellTax}%
<b>⛽️ GAS:</b> ${tokenInfo.BuyGas.toLocaleString()} | ${tokenInfo.SellGas.toLocaleString()}

<b>Chain:</b> ${tokenInfo.Chain.Name} (${tokenInfo.Chain.ShortName}) 🌐
<b>Router:</b> <a href="https://etherscan.io/address/${tokenInfo.Router}">${tokenInfo.Router}</a> 🔄

<b>Uniswap Pair:</b> ${tokenInfo.Pair.Pair.Name} 🧩
<b>Pair Address:</b> <a href="https://etherscan.io/address/${tokenInfo.PairAddress}">${tokenInfo.PairAddress}</a> 🔗
<b>Liquidity:</b> ${tokenInfo.Pair.Liquidity.toLocaleString()} USD 💧
`;
    sendMessage("@"+channel, message);*/
    return result;
  } catch (error) {
    console.error('Error checking honeypot');
    return false;
  }
};

module.exports = checkHoneypot;
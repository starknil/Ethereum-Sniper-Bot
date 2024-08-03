const sendMessage = require('./sendMessage');
const db = require('./database');
const { Web3, web3 } = require('./web3');
const channel = "sniperdemochannel";

const fetchTokenDetails = async (contractAddress) => {
  try {
    // Function to clean hex data and convert to UTF-8 string
    function cleanHexToUtf8(hexData) {
      if (hexData.startsWith('0x')) {
        hexData = hexData.slice(2);
      }
      let cleanedHex = hexData.replace(/^0+/, '');
      let utf8String = web3.utils.hexToUtf8('0x' + cleanedHex).trim();
      return utf8String.replace(/\u0000/g, '').replace(/\s+/g, ' ').trim();
    }

    // Function to fetch data from the contract
    const fetchData = async (method) => {
      const data = await web3.eth.call({
        to: contractAddress,
        data: web3.utils.sha3(`${method}()`).slice(0, 10)
      });
      return data;
    };

    const nameData = await fetchData('name');
    const name = cleanHexToUtf8(nameData);

    const symbolData = await fetchData('symbol');
    const symbol = cleanHexToUtf8(symbolData);

    const decimalsData = await fetchData('decimals');
    const decimals = parseInt(web3.utils.hexToNumberString(decimalsData).trim(), 10);

    const totalSupplyData = await fetchData('totalSupply');
    const totalSupplyHex = totalSupplyData.startsWith('0x') ? totalSupplyData.slice(2) : totalSupplyData;
    const totalSupplyBigInt = BigInt('0x' + totalSupplyHex);
    const formattedTotalSupply = (totalSupplyBigInt / BigInt(10 ** decimals)).toLocaleString();

    console.log("New Contract", name, symbol, decimals, formattedTotalSupply);

    const subscribeTo = await db.find({ newTokens: "❌" });
    subscribeTo.unshift({ userId: "@" + channel });

    const contractMessage = `
<b>📦 New Contract Detected:</b>

<b>🔗 Contract Address:</b> <a href="https://etherscan.io/address/${contractAddress}">${contractAddress}</a>
<b>📛 Name:</b> ${name}
<b>🔠 Symbol:</b> ${symbol}
<b>🔢 Decimals:</b> ${decimals}
<b>💰 Total Supply:</b> ${formattedTotalSupply}
`;

    for (const user of subscribeTo) {
      try {
        await sendMessage(user.userId, contractMessage);
      } catch (err) {
        console.error(`Error sending message to ${user.userId}:`, err);
      }
    }

    return true;

  } catch (err) {
    //console.error('Error fetching token details:', err);
    return false;
  }
}

module.exports = fetchTokenDetails;
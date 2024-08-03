const getPrice = require("./getPrice");
const { Web3, web3 } = require('./web3');


const getBalance = async (address) => {
  try {
    if (!web3.utils.isAddress(address)) {
      console.log('Invalid Ethereum address');
      return 0;
    }
    const balanceWei = await web3.eth.getBalance(address);
    const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
    if (balanceEther === '0.') {
      return 0;
    }
    return balanceEther;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
}



const mainMenu = async  (ctx,edited = null,user) => {
  const userId = ctx.from.id;
  const wallet1 = user.wallet1;
  const wallet2 = user.wallet2;
  const wallet3 = user.wallet3;

  let name,address1,address2,address3,price1,price2,price3;
  if (!wallet1){
    price1 = 0;
    address1 = "🔴 No address connected";
  }else{
    address1 = wallet1.address;
    price1 = await getBalance(address1);
  }

  if (!wallet2){
    price2 = 0;
    address2  = "🔴 No address connected"
  }else{
    address2 = wallet2.address;
    price2 = await getBalance(address2);
  }

  if (!wallet3){
    price3 = 0;
    address3 = "🔴 No address connected"
  }else{
    address3 = wallet3.address;
    price3 = await getBalance(address3);
  }

  const usd = await getPrice("ETH");
  const usd1 = price1 * usd;
  const usd2 = price2 * usd;
  const usd3 = price3 * usd;

  if (edited === null){
    name = ctx.message.chat.first_name;
  }else{
    name = ctx.from.first_name;
  }
  const txt = `
<b>👋🏻 Hello ${name || "😎 Boss"}, I am a bot that monitors new contracts on Uniswap and Ethereum.</b>

🪙 Ethereum price: <code>${usd} USD</code>

<b>⟠ <a href="https://etherscan.io/address/${address1}">Wallet1:</a></b> <code>${address1}</code>
⛽️<b> Ether:</b> <code>${price1} eth ~ ${usd1}$</code>

<b>⟠ <a href="https://etherscan.io/address/${address2}">Wallet2:</a></b> <code>${address2}</code>
⛽️<b> Ether:</b> <code>${price2} eth ~ ${usd2}$</code>

<b>⟠ <a href="https://etherscan.io/address/${address3}">Wallet3:</a></b> <code>${address3}</code>
⛽️<b> Ether:</b> <code>${price3} eth ~ ${usd3}$</code>

<b>🦄 <a href="https://app.uniswap.org/">Uniswap</a> || 🪙 <a href="https://etherscan.io/">Ether</a> || 🎯 <a href="https://www.dextools.io/app/en/hot-pairs">DEXtools</a></b>
`;

  // let's go Bot developed by Stark nil t.me/stark_nilxx
  let newBlocks,enable1,newTokens,autoBuy,enable2,autoSell,uniswap,enable3,newPairs,u1,u2,u3,buySlippage,sellSlippage;

  newBlocks = user.newBlocks;
  newTokens = user.newTokens;
  autoBuy = user.autoBuy;
  autoSell = user.autoSell;
  uniswap = user.uniswap;
  newPairs = user.newPairs;
  u1 = "/cc_enable_1";
  u2 = "/cc_enable_2";
  u3 = "/cc_enable_3";
  buySlippage = user.buySlippage || 1;
  sellSlippage = user.sellSlippage || 1;


  if (newBlocks === "❌" && newTokens === "❌"){
    enable1 = "Disable ❌";
    u1 = "/cc_disable_1";
  }else{
    enable1 = "Enable ✅";
  }

  if (autoSell === "❌" && autoBuy === "❌"){
    enable2 = "Disable ❌";
    u2 = "/cc_disable_2";
  }else{
    enable2  = "Enable ✅";
  }

  if (uniswap === "❌" && newPairs === "❌"){
    enable3 = "Disable ❌";
    u3 = "/cc_disable_3";
  }else{
    enable3 = "Enable ✅";
  }
  const keys = [
      [
        {
          text: "🛸 Ethereum Sniper Bot 🛸",
          callback_data: "sniperbot"
        }
      ],
      [
        {
          text: "⬩ Wallet 1 ⬩",
          callback_data: "wallet_1"
        },
        {
          text: "⬩ Wallet 2 ⬩",
          callback_data: "wallet_2"
        },
        {
          text: "⬩ Wallet 3 ⬩",
          callback_data: "wallet_3"
        }
      ],
      [
        {
          text: "Ξ Buy %",
          callback_data: "per_1"
        },
        {
          text: "Ξ Buy %",
          callback_data: "per_2"
        },
        {
          text: "Ξ Buy %",
          callback_data: "per_3"
        }
      ],
      [
        {
          text: "New Blocks"+newBlocks,
          callback_data: "/those_newBlocks"
        },
        {
          text: enable1,
          callback_data: u1
        },
        {
          text: "New Token"+newTokens,
          callback_data: "/those_newTokens"
        }
      ],// let's go Bot developed by Stark nil t.me/stark_nilxx
      [
        {
          text: "Auto buy "+autoBuy,
          callback_data: "/those_autoBuy"
        },
        {
          text: enable2,
          callback_data: u2
        },
        {
          text: "Auto sell "+autoSell,
          callback_data: "/those_autoSell"
        }
      ],
      [
        {
          text: `🧩 Buy Slippage (${buySlippage}%)`,
          callback_data: "/slippage_buy"
        },
        {
          text: `🧩 Sell Slippage (${sellSlippage}%)`,
          callback_data: "/slippage_sell"
        }
      ],
      [
        {
          text: "Uniswaps "+uniswap,
          callback_data: "/those_uniswap"
        },
        {
          text: enable3,
          callback_data: u3
        },
        {
          text: "New Pairs "+newPairs,
          callback_data: "/those_newPairs"
        }
      ],
      [
        {
          text: "👝 Management",
          callback_data: "management"
        },
        {
          text: "📑 Guides",
          callback_data: "guide"
        }
      ],
      [
        {
          text: "⧫ Official channel ⧫",
          url: "https://t.me/sniperdemochannel"
        },
        {
          text: "⧫ Official group ⧫",
          url: "https://t.me/sniperdemochannel"
        }
      ],
      [
        {
          text: "On all 🟢",
          callback_data: "all_on"
        },
        {
          text: "🔂 Refresh",
          callback_data: "refresh"
        },
        {
          text: "Off all 🔴",
          callback_data: "all_off"
        }
      ]// let's go Bot developed by Stark nil t.me/stark_nilxx
    ];

  const deals = {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: keys
      }
  };
  try {
    if (!edited){
      await ctx.reply(txt, deals);
    }else{
      await ctx.telegram.editMessageText(userId, edited, null, txt, deals);
    }
  }catch(e){

  }
};



module.exports = mainMenu;
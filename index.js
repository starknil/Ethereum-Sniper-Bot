const WebSocket = require('ws');
const { ethers } = require('ethers');
const axios = require('axios');



const { Web3 , web3 } = require('./src/web3');
const mainMenu = require('./src/mainMenu');
let { connectDataBase, getUser, addUser, updateUser, allUser, find } = require('./src/database');
const { bot, Scenes, stage } = require('./src/bot');
const sendMessage = require('./src/sendMessage');
const fetchTokenDetails = require('./src/fetchNewTokenDetails');
const fetchPairs = require('./src/fetchPairs');
const fetchLiquidityLock = require('./src/fetchLiquidityLock');
const checkHoneyPot = require('./src/checkHoneyPot');
const topHolders = require('./src/topHolders');
const fetchAbi = require('./src/fetchAbi');
const checkRenounce = require('./src/checkRenounce');
const balanceOf = require('./src/balanceOf');
const buyToken = require('./src/buyToken');
const sellToken = require('./src/sellToken');
const testBuyToken = require('./src/testBuyToken');


const infuraId = "a344e30144bf4321bf79328d575c50b4";
const uniswapApi = "02312c3426f3e82a110c756452d805f6";
const ws = new WebSocket('wss://mainnet.infura.io/ws/v3/' + infuraId);
const admin = 5626151907;
let channel = "sniperdemochannel";
const UNISWAP_SUBGRAPH_URL = `https://gateway-arbitrum.network.thegraph.com/api/${uniswapApi}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;
const ETHERSCAN_API_KEY = "82VTZJ45AFCQKDBII4XNFM894JQSRG4R44";


connectDataBase();

// WS functions

ws.on('open', function open() {
  console.log('WebSocket connection opened.');
  ws.send(JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_subscribe',
    params: ['newHeads'],
    id: 1
  }));
});

/*
ws.on('message', async function incoming(data) {
  try {
    const jsonData = JSON.parse(data.toString());
    if (jsonData.method !== 'eth_subscription') {
      return;// let's go Bot developed by Stark nil t.me/stark_nilxx
    }
    const blockHeader = jsonData.params.result;
    const block = await web3.eth.getBlock(blockHeader.hash, true);
    if (!block || !block.transactions) {
      return;
    }
    const blockMessage = `
<b>📦 New Mined Block</b>

<b>🔢 Block Number:</b> ${blockHeader.number}
<b>🔗 Block Hash:</b> <a href="https://etherscan.io/block/${blockHeader.hash}">${blockHeader.hash}</a>
<b>💰 Transactions:</b> ${block.transactions.length}
<b>⛽ Gas Used:</b> ${block.gasUsed}
<b>🛠️ Gas Limit:</b> ${block.gasLimit}
<b>🏗️ Miner:</b> <a href="https://etherscan.io/address/${block.miner}">${block.miner}</a>
<b>📉 Difficulty:</b> ${block.difficulty}
<b>📈 Total Difficulty:</b> ${block.totalDifficulty}
<b>⏰ Timestamp:</b> ${new Date(blockHeader.timestamp * 1000).toLocaleString()}`;// let's go Bot developed by Stark nil t.me/stark_nilxx
    const subscribeTo = await find({ newBlocks: "❌" })
    subscribeTo.unshift({ userId: "@" + channel });
    for (const user of subscribeTo){
      await sendMessage(user.userId, blockMessage);
    }

   for (const transaction of block.transactions) {

     if (transaction.to === null){ 
       const transactionHash = transaction.hash;
       const receipt = await web3.eth.getTransactionReceipt(transactionHash);
       const contractAddress = receipt.contractAddress;
       if (contractAddress) {
         const code = await web3.eth.getCode(contractAddress);
         if (code !== '0x') {
           const isLegit = await fetchTokenDetails(contractAddress);
           if (!isLegit){
             console.log("Contract details is not valid");
             return;
           }
           setTimeout(async () => {           
             console.log("Contract details is valid");

             try {


             await checkAll(contractAddress);
             

                
             } catch (err) {
                console.log("Error while validating buying authenticity ", err);
             }
             
             
           },1 * 60 * 30);

         }
       }
     }
   }
  }catch (err) {
    console.error('Error parsing or processing received data:', err);
  }
});
*/


ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
});



ws.on('close', function close() {
  console.log('WebSocket connection closed.');
});


// Web socket is now done \\




const fetchLiquidityLocks = async (pairAddress) => {
  
  try {

    let locks = await fetchLiquidityLock(pairAddress,uniswapApi);
    if (!locks){
      return;
    }
    console.log("Liquidity is locked");
  } catch (error) {
    console.error('Error fetching liquidity lock data:', error);
  }
  
};


//fetchLiquidityLocks('0x8076a535c76D087f22A635B95F28dC89C64E36A9');










/*
async function checkAll(tokenAddress){
  
  try {
    const pair = await fetchPairs(tokenAddress);
    if (!pair){
      console.log("No pairs found for "+tokenAddress+", skipped token");
      return;
    }
    //console.log(pair);
    let score = 0;
    const isHoneypot = await checkHoneyPot(tokenAddress);
    let honeypot;
    //console.log(isHoneypot)
    if (!isHoneypot){
      honeypot = "Unverifiable ⚠️";
    }else{
      if (isHoneypot.IsHoneypot){
        honeypot = "Yes ⚠️";
      }else{
        honeypot = "No ✅";
        score += 20;
      }
    }
    const isRenounced = await checkRenounce(tokenAddress);
    let renounced;
    if (isRenounced){
      renounced = "Yes ✅";
      score += 20;
    }else{
      renounced = "No ⚠️";
    }
    liquidity = pair.liquidity.usd;
    if (liquidity < 100){
      score += 1;
    }else if (liquidity < 1000){
      score += 5;
    }else if (liquidity < 10000){
      score += 10;
    }else if (liquidity < 50000){
      score += 20;
    }else{
      score += 30;
    }

    const burnedBalance = await balanceOf(tokenAddress,"0x000000000000000000000000000000000000dEaD");
    if (!burnedBalance || burnedBalance === 0){
      burned = "No ⚠️";
    }else{
      burned = "Yes ✅";
      score += 3;
    }

    const decimalsData = await web3.eth.call({
      to: tokenAddress,
      data: web3.utils.sha3(`decimals()`).slice(0, 10)
    });
    const decimals = parseInt(web3.utils.hexToNumberString(decimalsData).trim(), 10);
    
    const totalSupplyData = await web3.eth.call({
        to: tokenAddress,
        data: web3.utils.sha3(`totalSupply()`).slice(0, 10)
      });
    const totalSupplyHex = totalSupplyData.startsWith('0x') ? totalSupplyData.slice(2) : totalSupplyData;
    const totalSupplyBigInt = BigInt('0x' + totalSupplyHex);
    const totalSupply = (totalSupplyBigInt / BigInt(10 ** decimals));


    const burnedPercentage = (Number(BigInt(burnedBalance)) / Math.pow(10, decimals) / Number(BigInt(totalSupply)) * 100).toFixed(1);
    
    const holders = await topHolders(tokenAddress,5);
    let holdersText = "";
    if (!holders || holders.length <= 0){
      holdersText = "<code>No current holder</code>"
    }else{
      holdersText =
        holders.map((holder,index) => `<code>${((parseFloat(holder.amount) / parseFloat(totalSupply)) * 100).toFixed(1) }%</code>` + (index < 10 ? " <b>|</b> " : "")).join("");
    }
    
    console.log("All details fetched");

    const msg = `
<b>🚀🎯 New Liquidity Pool Created 🎯🚀</b>

🦄 Uniswap Liquidity <b>Pool Address:</b> <a href="https://dexscreener.com/ethereum/${pair.pairAddress}">${pair.pairAddress}</a>
🌐 Token <b>Address:</b> <code>${tokenAddress}</code>
Token <b>Name:</b> ${pair.baseToken.name} 🚀
Token <b>Symbol:</b> ${pair.baseToken.symbol} 🏷️

🔥 Liquidity <b>BURNED:</b> ${burned} ${(!burnedBalance || burnedBalance === 0) ? "" : `(${burnedPercentage}%)`}
💯 Ownership <b>Renounced:</b> ${renounced}
⁉️<b> Is Honeypot:</b> ${honeypot}

💯 Sniper <b>Bot Score -</b> ${score}/100%

<b>✅ DexScreener:</b> Updated TODAY ✅
<b>✅ DexTools:</b> Updated TODAY ✅

<b>💧 Liquidity:</b> ${liquidity.toLocaleString()} USD

<b>📦 Total Supply:</b> ${totalSupply.toLocaleString()}
<b>👥 Top 5 Holders:</b> ${holdersText}

⚠️ <i>For more information about whether the liquidity is locked or not, check this token on <a href="https://dexscreener.com/ethereum/${pair.pairAddress}">Dexscreener</a></i>
`;
    sendMessage("@"+channel, msg);
    
    //await testBuyToken(tokenAddress, totalSupplyBigInt, pair.priceUsd, decimals);

  }catch (e){
    console.log("Error fetching full details ",e);
  }
  
}
*/
//checkAll("0x7196f8cc95FE3f318De4ba81Bb6098371B6b64Cf");



//testBuyToken();










// Bot developed by Stark nil t.me/stark_nilxx


// BOT OUTPUTS \\


bot.catch((error,ctx) => {
  console.log(`An error occurred while using the bot's command: ${error}`);
});



bot.start(async ctx => {
  const userId = ctx.from.id;
  let user = await getUser(userId);
  if (!user){
    const newUser = {
      userId: userId,
      wallet1: null,
      wallet2: null,
      wallet3: null,
      newBlocks: "✅",
      newTokens: "✅",
      autoBuy: "✅",
      autoSell: "✅",
      uniswap: "✅",
      newPairs: "✅",
      buySlippage: null,
      sellSlippage: null,
      date_joined: Date.now(),
    }
    await addUser(newUser);
    user = await getUser(userId);
  }
  mainMenu(ctx,null,user);
});



bot.action('refresh', async ctx => {
  const userId = ctx.from.id;
  let user = await getUser(userId);
  ctx.answerCbQuery();
  mainMenu(ctx,ctx.callbackQuery.message.message_id,user);
});



bot.action('sniperbot', ctx => ctx.answerCbQuery());


// let's go Bot developed by Stark nil t.me/stark_nilxx
bot.action(/cc_(.+)_(.+)/,async ctx => {
  ctx.answerCbQuery();
  const userId = ctx.from.id;
  let user = await getUser(userId);
  if (!user){
    return;
  }
  const type = ctx.match[1] === "disable" ? "✅" : "❌";
  const which = ctx.match[2];

  if (which === "1"){
    await updateUser(userId, {
      $set: {
        newBlocks: type,
        newTokens: type
      }
    });
  }else if (which === "2"){
    await updateUser(userId, {
      $set: {
        autoBuy: type,
        autoSell: type
      }
    });
  }else if (which === "3"){
    await updateUser(userId, {
      $set: {
        uniswap: type,
        newPairs: type
      }
    })
  }else{
    return;
  }
    user = await getUser(userId);
mainMenu(ctx,ctx.callbackQuery.message.message_id,user);
});
// let's go Bot developed by Stark nil t.me/stark_nilxx



bot.action(/\/those_(.+)/, async ctx => {
  ctx.answerCbQuery();

  const userId = ctx.from.id;
  const type = ctx.match[1];

  let user = await getUser(userId);
  if (!user) {
    return;
  }

  const newState = user[type] === "✅" ? "❌" : "✅";

  await updateUser(userId, {
    $set: {
      [type]: newState
    }
  });

  user = await getUser(userId);

  mainMenu(ctx, ctx.callbackQuery.message.message_id, user);
});



bot.action(/all_(.+)/,async ctx => {
  ctx.answerCbQuery();
  const userId = ctx.from.id;
  const type = ctx.match[1];
  let user = await getUser(userId);
  if (!user){
    return;
  }
  const newState = type === "on" ? "❌" : "✅";
  await updateUser(userId, {
    $set: {
      newBlocks: newState,
      newTokens: newState,
      autoBuy: newState,
      autoSell: newState,
      uniswap: newState,
      newPairs: newState
    }
  });// let's go Bot developed by Stark nil t.me/stark_nilxx
  user = await getUser(userId);
  mainMenu(ctx, ctx.callbackQuery.message.message_id, user);

});


bot.action(/wallet_(.+)/, async ctx => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;
  const user = await getUser(userId);

  if (!user) {
    await ctx.reply("You are not registered");
    return;
  }

  const which = ctx.match[1];
  const wallet = user["wallet" + which];

  if (!wallet) {
    await ctx.reply("🔴 No wallet connected", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "⬩ Connect wallet ⬩",// let's go Bot developed by Stark nil t.me/stark_nilxx
              callback_data: `connect_${which}`
            }
          ]
        ]
      }
    });
  } else {
    await ctx.reply("🟢 Wallet already connected");
  }
});



bot.action(/connect_(.+)/, async ctx => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;
  const user = await getUser(userId);

  if (!user) {
    await ctx.reply("You're not registered");
    return;
  }

  const which = ctx.match[1];
  if (user["wallet" + which]) {
    await ctx.reply("🟢 Wallet already connected");
    return;
  }

  await ctx.editMessageText("Choose a method below...", {
    reply_markup: {
      inline_keyboard: [
        [// let's go Bot developed by Stark nil t.me/stark_nilxx
          {
            text: "Auto connection",
            callback_data: `auto_${which}`
          },
          {
            text: "Manual connection",
            callback_data: `manual_${which}`
          }
        ]
      ]
    }
  });
});



bot.action(/auto_(.+)/, async ctx => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;
  const msgid = ctx.callbackQuery.message.message_id;
  const user = await getUser(userId);
  if (!user){
    await ctx.reply("You are not registered");
    return;
  }
  const which = ctx.match[1];

  if (user["wallet" + which]) {
    await ctx.reply("🟢 Wallet already connected");
    return;
  }
  await ctx.editMessageText("<i>Auto generating wallet for you...</i>",{
    parse_mode: "HTML"
  });
  const wallet = ethers.Wallet.createRandom();
  const mnemonic = wallet.mnemonic.phrase;
  const address = wallet.address;
  const privateKey = wallet.privateKey;
  updateUser(userId, {
    $set: {// let's go Bot developed by Stark nil t.me/stark_nilxx
      ['wallet'+which]: {
        mode: "Auto",
        address: address,
        privateKey: privateKey,
        mnemonic: mnemonic
      }
    }
  })
  ctx.telegram.editMessageText(userId, 
msgid, null,`
<b>🟢 Wallet generate successfully

🔗 Address:</b> <code>${address}</code>
🔐<b> Password:</b> <code>no password</code>
<b>🔑 Private Key:</b> <code>${privateKey}</code>
<b>📝 Mnemonic:</b> <code>${mnemonic}</code>

⚠️<b> NOTE:</b> <i>Make sure to save this mnemonic phrase OR private key using pen and paper only. Do NOT copy-paste it anywhere. You could also import it to your Metamask/Trust Wallet. After you finish saving/importing the wallet credentials, delete this message. The bot will not display this information again.</i>
`, {
  parse_mode: "HTML"
});
});// let's go Bot developed by Stark nil t.me/stark_nilxx



bot.action(/manual_(.+)/, async ctx => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;
  const user = await getUser(userId);
  if (!user) {
    await ctx.reply("You are not registered");
    return;
  }
  const which = ctx.match[1];

  if (user["wallet" + which]) {
    await ctx.reply("🟢 Wallet already connected");
    return;
  }


  const keyScene = new Scenes.BaseScene("key" + userId);

  keyScene.enter(async ctx => {

  await ctx.reply("<i>Please enter your wallet's private key</i>", {
      parse_mode: "HTML",
      reply_markup: {
        input_field_placeholder: "Enter your private key.....",
        keyboard: [
          [
            {
              text: "Cancel"
            }
          ]
        ],
        resize_keyboard: true
      }
    });
  });
  // let's go Bot developed by Stark nil t.me/stark_nilxx
  keyScene.on('text', async ctx => {
    const key = ctx.message.text;
    if (key === "Cancel") {
      ctx.scene.leave();
      await ctx.reply("Operation cancelled", {
        reply_markup: {
          remove_keyboard: true
        }
      });
      mainMenu(ctx, null, user);
      return;
    }
    if (key.length < 64 && key.length > 66){
      await ctx.reply("<i>Invalid private key</i>", {
        parse_mode: "HTML",
        reply_markup: {
          input_field_placeholder: "Enter your private key.....",
          keyboard: [
            [// let's go Bot developed by Stark nil t.me/stark_nilxx
              {
                text: "Cancel"
              }
            ]
          ],
          resize_keyboard: true
        }
      });
      return;
    }
    await ctx.deleteMessage();
      ctx.reply("<i>🖐🏻 Wait, validating your private key...</i>",
        {
          parse_mode: "HTML",
          reply_markup: {
            remove_keyboard: true
          }
        }
      );

    try {
       const wallet = new ethers.Wallet(key);
      const address = wallet.address;
      await ctx.scene.leave();
      updateUser(userId, {
        $set: {
          ['wallet'+which]: {
            mode: "Manual",
            address: /* let's go Bot developed by Stark nil t.me/stark_nilxx*/address,
            privateKey: key,
            mnemonic: null
          }
        }
      });
        await ctx.reply(`
<b>🟢 Wallet linked successfully

🔗 Address:</b> <code>${address}</code>
🔐<b> Password:</b> <code>no password</code>
<b>🔑 Private Key:</b> <code>${key}</code>
<b>📝 Mnemonic:</b> <code>none</code>

⚠️<b> NOTE:</b> <i>Do not share your private key with anyone.</i>
      `, {
        parse_mode: "HTML",
        reply_markup: {
          remove_keyboard: true
        }
      });
    } catch (err) {
       await ctx.reply("<i>Invalid private key</i>", {
         parse_mode: "HTML",// let's go Bot developed by Stark nil t.me/stark_nilxx
         reply_markup: {
           input_field_placeholder: "Enter your private key.....",
           keyboard: [
             [
               {
                 text: "Cancel"
               }
             ]
           ],
           resize_keyboard: true
         }
       });
    }
  });

  stage.register(keyScene);
  ctx.scene.enter("key" + userId);
});




bot.action(/\/slippage_(.+)/, async ctx => {
  ctx.answerCbQuery();
  const type = ctx.match[1];
  if (type !== "buy" && type !== "sell"){
    ctx.reply("Invalid type");
    console.log(type);
    return;
  }
  const user = await getUser(ctx.from.id);
  if (!user){
    return;
  }
  const sellSlippage = user["sellSlippage"]
  const buySlippage = user["buySlippage"]

  const slippageScene = new Scenes.BaseScene("slippage" + ctx.from.id);

  slippageScene.enter(ctx => {
    ctx.replyWithHTML(`Send a ${type} slippage percentage (0.1-100), currenct: ${type === "buy" ? buySlippage|| "<b>Default (1)</b>" : sellSlippage || "<b>Default (1)</b>"}%`, {
      reply_markup: {
        input_field_placeholder: "Enter "+type+" slippage %...",
        keyboard: [
          [
            {
              text: "Cancel"
            }
          ]
        ],
        resize_keyboard: true
      }
    });
  });

  slippageScene.on('text', async ctx => {
    const slippage = ctx.message.text;
    if (slippage === "Cancel") {
      ctx.scene.leave();
      await ctx.reply("Operation cancelled", {
        reply_markup: {
          remove_keyboard: true
        }
      });
      mainMenu(ctx, null, user);
      return;
    }
    if (isNaN(slippage) || slippage < 0.1 || slippage > 100){
      await ctx.reply("Invalid slippage percentage\n\nMust be number\nMust not less than 0.1\nMust not greater than 100", {
        parse_mode: "HTML",
        reply_markup: {
          input_field_placeholder: "Enter "+type+" slippage %...",
          keyboard: [
            [
              {
                text: "Cancel"
              }
            ]
          ],
          resize_keyboard: true
        }
      });
      return;
    }
    await updateUser(ctx.from.id, {
      $set: {
        [type + "Slippage"]: slippage
      }
    });
    ctx.reply(`<b>✅ ${type} slippage set to ${slippage}%</b>`, {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true
      }
    });
  });
  stage.register(slippageScene);
  ctx.scene.enter("slippage" + ctx.from.id);
});




bot.on('callback_query',async ctx =>  {
  try {
    await ctx.answerCbQuery("❌",{show_alert: true})
  }catch (e){
    console.log("Call back query error");
  }
});

bot.launch();
console.log(`Bot has been successfully launched...`);

// let's go Bot developed by Stark nil t.me/stark_nilxx
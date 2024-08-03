const { web3 } = require('./web3');
const getPriceInEth = require('./getPrice');
const fetchAbi = require('./fetchAbi');
const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";


let ethPrice;


(async function() {
  try {
    ethPrice = await getPriceInEth();
    console.log('ETH Price:', ethPrice);
  } catch (error) {
    console.error('Error fetching ETH price:', error);
  }
})();

const approveToken = async (tokenAddress, tokenAmount, routerAddress, walletAddress, privateKey) => {
  const abi = await fetchAbi(tokenAddress);
  const tokenContract = new web3.eth.Contract(JSON.parse(abi), tokenAddress);

  const data = tokenContract.methods.approve(routerAddress, tokenAmount).encodeABI();

  const tx = {
    from: walletAddress,
    to: tokenAddress,
    gas: 200000,
    gasPrice: web3.utils.toWei('50', 'gwei'),
    data: data
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log('Approval transaction receipt:', receipt);
};

async function sellToken(tokenAddress, tokenAmount, minAmountOut, path, to, deadline, privateKey) {
  const routerABI = await fetchAbi(routerAddress);
  const routerContract = new web3.eth.Contract(JSON.parse(routerABI), routerAddress);
  const data = routerContract.methods.swapExactTokensForETH(
    tokenAmount,
    minAmountOut,
    path,
    to,
    deadline
  ).encodeABI();

  const tx = {
    from: to,
    to: routerAddress,
    gas: 200000,
    gasPrice: web3.utils.toWei('50', 'gwei'),
    data: data
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log('Sell transaction receipt:', receipt);
}

const sellTokenFunction = async (tokenAddress, balance, tokenPrice, decimals) => {

  if (!ethPrice) {
    throw new Error('ETH price is not set.');
  }

  const tokenAmount = BigInt(balance);

  const costInUSD = BigInt(Math.round(tokenPrice * 10 ** decimals)) * tokenAmount;

  const amountInETH = costInUSD / BigInt(Math.round(ethPrice * 10 ** 18));

  const amountIn = web3.utils.toWei(amountInETH.toString(), 'ether');
  const slippage = 0.1 || 1;
  const slippagePercent = BigInt(Math.round(slippage * 10000));
  
  const minAmountOut = BigInt(amountIn) * (BigInt(10000) - slippagePercent)/ BigInt(10000);
  
  const path = [web3.utils.toChecksumAddress(tokenAddress), web3.utils.toChecksumAddress('0x0000000000000000000000000000000000000000')]; // Token to ETH
  const to = "0x2De607990662E23b180745AC54a13e4Ab33B73ea";
  const privateKey = process.env.PRIVATE_KEY;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  await approveToken(tokenAddress, tokenAmount, routerAddress, to, privateKey);

  await sellToken(tokenAddress, tokenAmount, minAmountOut, path, to, deadline, privateKey);
};

module.exports = sellTokenFunction;
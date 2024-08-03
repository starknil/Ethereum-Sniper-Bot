const { web3 } = require('./web3');
const getPriceInEth = require('./getPrice');
const fetchAbi = require('./fetchAbi');
const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
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
  console.log(`Waiting for approval`);
  const abi = await fetchAbi(tokenAddress);
  const tokenContract = new web3.eth.Contract(JSON.parse(abi), tokenAddress);

  const data = tokenContract.methods.approve(routerAddress, tokenAmount.toString()).encodeABI();

  const tx = {
    from: walletAddress,
    to: tokenAddress,
    gas: 100000, // Adjusted gas limit for approval
    gasPrice: web3.utils.toWei('50', 'gwei'),
    data: data
  };

  try {
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log('Approval transaction receipt:', receipt);
  } catch (error) {
    console.error('Error during token approval:', error);
  }
};

const swapToken = async (amountIn, amountOutMin, path, to, deadline, privateKey) => {
  try {
    const routerABI = await fetchAbi(routerAddress);
    const routerContract = new web3.eth.Contract(JSON.parse(routerABI), routerAddress);

    // Ensure the path is correct
    const data = routerContract.methods.swapExactETHForTokens(
      amountOutMin,
      path,
      to,
      deadline
    ).encodeABI();

    const gasPrice = await web3.eth.getGasPrice();
    console.log(`Current gas price: ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei (${gasPrice} Wei)`);

    const tx = {
      from: to,
      to: routerAddress,
      value: amountIn,
      gas: 200000, // Adjusted gas limit for swap
      gasPrice: gasPrice,
      data: data
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log('Swap transaction receipt:', receipt);
  } catch (error) {
    console.error('Error during token swap:', error);
  }
};

const buyToken = async (tokenAddress, totalSupply, tokenPrice, decimals) => {
  if (!ethPrice) {
    throw new Error('ETH price is not set.');
  }

  const tokenAmount = BigInt(1) * BigInt(10 ** 6); // Assuming USDT has 6 decimals
  console.log(`Buying... 1 USDT`);

  // Convert USD value to ETH
  const costInUSD = BigInt(Math.round(tokenPrice * 10 ** decimals)) * BigInt(5);
  const amountInETH = costInUSD / BigInt(Math.round(ethPrice * 10 ** 18));

  const slippage = 0.1;
  const slippagePercent = BigInt(Math.round(slippage * 10000));

  const amountIn = web3.utils.toWei(amountInETH.toString(), 'ether');
  const amountOutMin = BigInt(amountIn) * (BigInt(10000) + slippagePercent) / BigInt(10000);

  // Adjust path to include WETH and the token address
  const path = [
    WETH_ADDRESS, // WETH address
    web3.utils.toChecksumAddress(tokenAddress)
  ];
  const to = "0x2De607990662E23b180745AC54a13e4Ab33B73ea";
  const privateKey = process.env['PRIVATE_KEY'];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  console.log(`Placing for approval`);
  await approveToken(tokenAddress, tokenAmount, routerAddress, to, privateKey);

  await swapToken(amountIn, amountOutMin, path, to, deadline, privateKey);
};

module.exports = buyToken;
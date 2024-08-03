const axios = require('axios');
const sendMessage = require('./sendMessage');
const channel = "sniperdemochannel";

const fetchLiquidityLocks = async (pairAddress,uniswapApi) => {
  try {
    const IS_LOCK_URL = `https://gateway.thegraph.com/api/${uniswapApi}/subgraphs/id/4twAeoq2GRjZGcRPu3bD2issfeuZpMLm5YPQsiHyyeUF`;

    const lockedQuery = `
    {
      lockedLPTokens(where: { lpToken: "${pairAddress}" }) {
        id
        locker {
          id
          totalLocks
        }
        locks {
          lockID
          amount
          initialAmount
          lockDate
          unlockDate
          owner
        }
        lpToken {
          id
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
      }
    }
    `;
    const liquidityQuery = `
{
  positions(where: { pool: "${pairAddress}" }) {
    id
    pool {
      id
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
    liquidity
    tickLower {
      id
    }
    tickUpper {
      id
    }
  }
}
`;

    const response = await axios.post(IS_LOCK_URL, {
      query: lockedQuery,
    });
    /*const response2 = await axios.post(IS_LOCK_URL, {
      query: liquidityQuery,
    });
    console.log(response2.data);*/
    let locks = response.data.data.lockedLPTokens;
    if (!locks){
      console.log("No liquidity lock found");
      return false;
    }
    if (locks.length === 0){
      console.log("No liquidity lock found");
      return false;
    }

    if (!locks || !locks[0]){
      console.log("No liquidity lock found");
      return false;
    }

    locks = locks[0];
    const lockId = locks.id;
    const lockerId = locks.locker.id;
    const lockerTotalLocks = locks.locker.totalLocks;
    const token0Symbol = locks.lpToken.token0.symbol;
    const token1Symbol = locks.lpToken.token1.symbol;
    const locksData = locks.locks;

    const message = `
<b>💧 Liquidity Lock Details</b>

<b>🔗 LP Token Address:</b> ${pairAddress}
<b>🔒 Locker ID:</b> ${lockerId}
<b>📊 Total Locks in Locker:</b> ${lockerTotalLocks}
    ${locksData.map(lock => `
<b>🔑 Lock ID:</b> ${lock.lockID}
<b>💵 Locked Amount:</b> ${parseFloat(lock.amount).toFixed(18)}
<b>💰 Initial Amount:</b> ${parseFloat(lock.initialAmount).toFixed(18)}

<b>📅 Lock Date:</b> ${new Date(lock.lockDate * 1000).toLocaleString()}
<b>📆 Unlock Date:</b> ${new Date(lock.unlockDate * 1000).toLocaleString()}
    `).join('')}
<b>🔸 Token Pairs:</b> ${token0Symbol}/${token1Symbol}
    `;

    await sendMessage("@"+channel,message);

    return locks;
  } catch (error) {
    console.error('Error fetching liquidity lock data:', error);
    return false;
  }
};


module.exports = fetchLiquidityLocks;
import axios from 'axios';
import { CLUSTER_API } from '../config/dev.js';

const getElixir = async (wallet: string) => {
    const res = await axios.post(CLUSTER_API, {
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
            wallet,
            {
                mint: "JAYDueSTMuhLYZEHZVXJrbSaYtgMfg78zGMpeiPRhxXA",
            },
            {
                encoding: "jsonParsed",
            },
        ],
    })
    return {
        tokenAccount: res.data.result?.value[0]?.pubkey,
        amount: res.data.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount
    }
}
export {
    getElixir
};

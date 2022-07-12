import axios, { AxiosInstance } from "axios";
import { AssetData, GasPrices, ParsedTx } from "./types";
import { STACKS_MAINNET_CHAIN_ID_PREFIXED, STACKS_TESTNET_CHAIN_ID_PREFIXED } from "@web3devs/stacks-wallet-connect"

const ethereumApi: AxiosInstance = axios.create({
  baseURL: "https://ethereum-api.xyz",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

//XXX: Not being used?
export async function apiGetAccountAssets(address: string, chainId: string): Promise<AssetData[]> {
  const ethChainId = chainId.split(":")[1];
  const response = await ethereumApi.get(
    `/account-assets?address=${address}&chainId=${ethChainId}`,
  );
  const { result } = response.data;
  return result;
}

export async function apiGetAccountBalance(address: string, chainId: string): Promise<AssetData> {
  const ethChainId = chainId.split(":")[1];
  if (chainId === STACKS_MAINNET_CHAIN_ID_PREFIXED || chainId === STACKS_TESTNET_CHAIN_ID_PREFIXED) {
    //TODO: move to helper function?
    const response = await ethereumApi.get(
      `https://stacks-node-api.testnet.stacks.co/extended/v1/address/${address}/balances`
    );
    const result = response.data;

    return {
      symbol: 'STX',
      name: 'Stacks',
      decimals: '6',
      contractAddress: 'STX',
      balance: result.stx.balance,
    }
  }
  const response = await ethereumApi.get(
    `/account-balance?address=${address}&chainId=${ethChainId}`,
  );
  const { result } = response.data;
  return result;
}

export async function apiGetAccountTransactions(
  address: string,
  chainId: string,
): Promise<ParsedTx[]> {
  const ethChainId = chainId.split(":")[1];
  const response = await ethereumApi.get(
    `/account-transactions?address=${address}&chainId=${ethChainId}`,
  );
  const { result } = response.data;
  return result;
}

export const apiGetAccountNonce = async (address: string, chainId: string): Promise<number> => {
  const ethChainId = chainId.split(":")[1];
  const response = await ethereumApi.get(`/account-nonce?address=${address}&chainId=${ethChainId}`);
  const { result } = response.data;
  return result;
};

export const apiGetGasPrices = async (): Promise<GasPrices> => {
  const response = await ethereumApi.get(`/gas-prices`);
  const { result } = response.data;
  return result;
};

import { NamespaceMetadata, ChainMetadata } from "../helpers";
import { STACKS_MAINNET_CHAIN_ID, STACKS_TESTNET_CHAIN_ID } from "@web3devs/stacks-wallet-connect"

export const StacksMetadata: NamespaceMetadata = {
  [STACKS_MAINNET_CHAIN_ID]: {
    logo: "/stacks_logo.jpg",
    rgb: "0, 0, 0",
  },
  [STACKS_TESTNET_CHAIN_ID]: {
    logo: "/stacks_logo.jpg",
    rgb: "0, 0, 0",
  },
};

export function getChainMetadata(chainId: string): ChainMetadata {
  const reference = chainId.split(":")[1];
  const metadata = StacksMetadata[reference];
  if (typeof metadata === "undefined") {
    throw new Error(`No chain metadata found for chainId: ${chainId}`);
  }
  return metadata;
}

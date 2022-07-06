import { ChainsMap } from "caip-api";
import { NamespaceMetadata, ChainMetadata } from "../helpers";

export const StacksChainData: ChainsMap = {
  "2020": {
    id: "stacks:2020",
    name: "Stacks Mainnet",
    rpc: ["https://stacks-node-api.stacks.co"],
    slip44: 5757,
    testnet: false,
  },
  "2019": {
    id: "stacks:2019",
    name: "Stacks Testnet",
    rpc: ["https://stacks-node-api.testnet.stacks.co"],
    slip44: 5757,
    testnet: true,
  },
};

export const StacksMetadata: NamespaceMetadata = {
  // Stacks Mainnet
  "2020": {
    logo: "/stacks_logo.jpg",
    rgb: "0, 0, 0",
  },
  // Stacks Testnet
  "2019": {
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

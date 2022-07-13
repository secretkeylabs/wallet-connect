import {
  STACKS_MAINNET_CHAIN_ID,
  STACKS_TESTNET_CHAIN_ID,
  STACKS_MAINNET_CHAIN_ID_PREFIXED,
  STACKS_TESTNET_CHAIN_ID_PREFIXED,
  StacksChainData,
} from "@web3devs/stacks-wallet-connect";

/**
 * Types
 */
export type TStacksChain = keyof typeof STACKS_MAINNET_CHAINS

/**
 * Chains
 */
export const STACKS_MAINNET_CHAINS = {
  [STACKS_MAINNET_CHAIN_ID_PREFIXED]: {
    chainId: STACKS_MAINNET_CHAIN_ID,
    name: StacksChainData[STACKS_MAINNET_CHAIN_ID].name,
    logo: 'https://assets-global.website-files.com/618b0aafa4afde9048fe3926/6197e600ab7fc410890d1bc8_hiro.jpg',
    rgb: '33, 66, 99',
    rpc: ''
  }
}

export const STACKS_TEST_CHAINS = {
  [STACKS_TESTNET_CHAIN_ID_PREFIXED]: {
    chainId: STACKS_TESTNET_CHAIN_ID,
    name: StacksChainData[STACKS_TESTNET_CHAIN_ID].name,
    logo: 'https://assets-global.website-files.com/618b0aafa4afde9048fe3926/6197e600ab7fc410890d1bc8_hiro.jpg',
    rgb: '33, 66, 99',
    rpc: ''
  }
}

export const STACKS_CHAINS = { ...STACKS_MAINNET_CHAINS, ...STACKS_TEST_CHAINS }

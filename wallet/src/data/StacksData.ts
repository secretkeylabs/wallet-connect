/**
 * Types
 */
export type TStacksChain = keyof typeof STACKS_MAINNET_CHAINS

/**
 * Chains
 */
export const STACKS_MAINNET_CHAINS = {
  'stacks:2020': {
    chainId: '2020',
    name: 'Stacks',
    logo: '/chain-logos/stacks-2020.png',
    rgb: '30, 240, 166',
    rpc: ''
  }
}

export const STACKS_TEST_CHAINS = {
  'stacks:2019': {
    chainId: '2019',
    name: 'Stacks Testnet',
    logo: '/chain-logos/stacks-2020.png',
    rgb: '30, 240, 166',
    rpc: ''
  }
}

export const STACKS_CHAINS = { ...STACKS_MAINNET_CHAINS, ...STACKS_TEST_CHAINS }

/**
 * Methods
 */
export const STACKS_SIGNING_METHODS = {
  STACKS_STX_TRANSFER: 'stacks_stxTransfer',
  STACKS_CONTRACT_CALL: "stacks_contractCall",
  STACKS_SIGN_MESSAGE: 'stacks_signMessage'
}

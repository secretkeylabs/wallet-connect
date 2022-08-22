import { ChainsMap } from "caip-api";

//Chain IDs
export const STACKS_MAINNET_CHAIN_ID: string = "1";
export const STACKS_TESTNET_CHAIN_ID: string = "2147483648";

//Prefixed chain ids for use with Wallet Connect
type StacksChainIDPrefixed = string;
export const STACKS_MAINNET_CHAIN_ID_PREFIXED: StacksChainIDPrefixed = "stacks:1";
export const STACKS_TESTNET_CHAIN_ID_PREFIXED: StacksChainIDPrefixed = "stacks:2147483648";

//Chain names
export const StacksChainData: ChainsMap = {
    [STACKS_MAINNET_CHAIN_ID]: {
        id: STACKS_MAINNET_CHAIN_ID_PREFIXED,
        name: "Stacks Mainnet",
        rpc: ["https://stacks-node-api.stacks.co"],
        slip44: 5757,
        testnet: false,
    },
    [STACKS_TESTNET_CHAIN_ID]: {
        id: STACKS_TESTNET_CHAIN_ID_PREFIXED,
        name: "Stacks Testnet",
        rpc: ["https://stacks-node-api.testnet.stacks.co"],
        slip44: 5757,
        testnet: true,
    },
};

//Default methods that "should" be implemented by all stacks wallets
export enum STACKS_DEFAULT_METHODS {
    SIGN_MESSAGE = "stacks_signMessage",
    STX_TRANSFER = "stacks_stxTransfer",
    CONTRACT_CALL = "stacks_contractCall",
    CONTRACT_DEPLOY = "stacks_contractDeploy",
}

//Default events that "should" be implemented by all stacks wallets
export enum STACKS_DEFAULT_EVENTS { }

export enum PostConditionTypes {
    StandardFungible = 'StandardFungible',
    ContractFungible = 'ContractFungible',
    StandardSTX = 'StandardSTX',
    ContractSTX = 'ContractSTX',
    StandardNonFungible = 'StandardNonFungible',
    ContractNonFungible = 'ContractNonFungible',
}
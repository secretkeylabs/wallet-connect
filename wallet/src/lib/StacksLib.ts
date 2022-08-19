import { generateWallet, Wallet } from "@stacks/wallet-sdk";
import { 
    makeSTXTokenTransfer, 
    makeContractCall, 
    broadcastTransaction, 
    AnchorMode, 
    hexToCV,
    ClarityValue
} from '@stacks/transactions';
import { StacksNetworkName } from '@stacks/network';
import { BigNumber } from 'bignumber.js';

import {
    PostConditionMode,
    FungibleConditionCode,
    uintCV,
    noneCV,
    standardPrincipalCV,
    cvToHex,
    makeStandardFungiblePostCondition,
    createAssetInfo
  } from '@stacks/transactions'

import { toRealCV, toRealPostCondition } from "@web3devs/stacks-wallet-connect";

/**
 * Types
 */
interface IInitArguments {
    secretKey?: Uint8Array
}

/**
 * Library
 */
export default class StacksLib {
    constructor() {}

    static init({ secretKey }: IInitArguments) {
        return new StacksLib()
    }

    public async getAddress() {
        return 'ST24YYAWQ4DK4RKCKK1RP4PX0X5SCSXTWQXFGVCVY'
    }

    public getSecretKey() {
        return 'oval mean brain hollow avoid battle year announce merge wing citizen north'
    }

    private async getWallet(): Promise<Wallet> {
        return await generateWallet({
            secretKey: this.getSecretKey(),
            password: '',
        });
    }

    public async signMessage(message: string) {
        return { signature: message + '+SIGNED' }
    }

    public async stxTransfer(params: any) {
        const wallet = await this.getWallet();

        const txOptions = {
            recipient: params.recipient,
            amount: new BigNumber(params.amount).times(1e6).toFixed(),
            senderKey: wallet.accounts[0].stxPrivateKey,
            network: 'testnet' as StacksNetworkName, // for mainnet, use 'mainnet'
            anchorMode: AnchorMode.Any,
        };

        const transaction = await makeSTXTokenTransfer(txOptions);

        // to see the raw serialized tx
        const serializedTx = transaction.serialize().toString('hex');

        // broadcasting transaction to the specified network
        const broadcastResponse = await broadcastTransaction(transaction);
        const txId = broadcastResponse.txid;

        console.log('SIGN TXN: ', txId);
        return { txId }
    }

    public async contractCall(params: any) {
        const wallet = await generateWallet({
            secretKey: this.getSecretKey(),
            password: '',
        });

        const functionArgs = [];
        for (const arg of params.functionArgs) {
            // functionArgs.push(arg as ClarityValue);
            functionArgs.push(hexToCV(arg));
        }

        const postConditions = [];
        for (const pc of params.postConditions) {
            // postConditions.push(pc);
            // postConditions.push(pc.function(...pc.functionArgs));
            // postConditions.push(funcs[pc.function](...pc.functionArgs));

            switch (pc.function) {
                case 'makeStandardFungiblePostCondition':
                    postConditions.push(makeStandardFungiblePostCondition.apply(this, pc.functionArgs));
                    break;
                default:
                    break;
            }
        }

        const txOptions = {
            senderKey: wallet.accounts[0].stxPrivateKey,
            network: 'testnet' as StacksNetworkName, // for mainnet, use 'mainnet'
            // validateWithAbi: true,
            contractAddress: params.contractAddress,
            contractName: params.contractName,
            functionName: params.functionName,
            functionArgs,
            postConditions,
            postConditionMode: params.postConditionMode,
            anchorMode: AnchorMode.Any,
        };

        const transaction = await makeContractCall(txOptions);

        // to see the raw serialized tx
        const serializedTx = transaction.serialize().toString('hex');

        // broadcasting transaction to the specified network
        const broadcastResponse = await broadcastTransaction(transaction);
        const txId = broadcastResponse.txid;

        console.log('SIGN TXN: ', txId);
        return { txId }
    }
}

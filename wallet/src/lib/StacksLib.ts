import { TokenSigner } from 'jsontokens';
import { SignaturePayload } from '@stacks/connect';
import { generateWallet, Wallet } from "@stacks/wallet-sdk";
import { makeSTXTokenTransfer, makeContractCall, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksNetworkName } from '@stacks/network';
import { BigNumber } from 'bignumber.js';

import {
    bufferCV,
    bufferCVFromString,
    noneCV,
    uintCV,
    stringAsciiCV,
    standardPrincipalCV,
    PostConditionMode,
    createAssetInfo,
    FungibleConditionCode,
    makeStandardFungiblePostCondition,
    makeStandardSTXPostCondition
} from '@stacks/transactions'

async function signPayload(payload: SignaturePayload, privateKey: string) {
    const tokenSigner = new TokenSigner('ES256k', privateKey);

    return tokenSigner.signAsync({
        ...payload,
    } as any);
}

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
        const wallet = await this.getWallet();
        const signed = await signPayload({ message } as SignaturePayload, wallet.accounts[0].stxPrivateKey);

        return { signature: signed }
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
        console.log('contractCall: ', params);
        const wallet = await generateWallet({
            secretKey: this.getSecretKey(),
            password: '',
        });

        const functionArgs = [];
        for (const arg of params.functionArgs) {
            switch (arg.type) {
                case 'uint':
                    functionArgs.push(uintCV(arg.value));
                    break;
                case 'buffer':
                    functionArgs.push(bufferCVFromString(arg.value));
                    break;
                case 'buffer34':
                    const b = Buffer.alloc(34);
                    b.write(arg.value, 0, 34, 'hex');
                    functionArgs.push(bufferCV(b));
                    break;
                case 'none':
                    functionArgs.push(noneCV());
                    break;
                case 'standardPrincipal':
                    functionArgs.push(standardPrincipalCV(arg.value));
                    break;
                default:
                    throw new Error(`Unknown argument type: ${arg.type}`);
            }
        }

        const txOptions = {
            senderKey: wallet.accounts[0].stxPrivateKey,
            network: 'testnet' as StacksNetworkName, // for mainnet, use 'mainnet'
            // validateWithAbi: true,
            contractAddress: params.contractAddress,
            contractName: params.contractName,
            functionName: params.functionName,
            functionArgs: functionArgs,
            // postConditions: params.postConditions,
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

import {
    FungibleConditionCode,
    NonFungibleConditionCode,
    PostCondition,
    makeStandardFungiblePostCondition as makeStandardFungiblePostConditionReal,
    makeContractFungiblePostCondition as makeContractFungiblePostConditionReal,
    makeStandardSTXPostCondition as makeStandardSTXPostConditionReal,
    makeContractSTXPostCondition as makeContractSTXPostConditionReal,
    makeStandardNonFungiblePostCondition as makeStandardNonFungiblePostConditionReal,
    makeContractNonFungiblePostCondition as makeContractNonFungiblePostConditionReal,
    bufferCVFromString as bufferCVFromStringReal,
    createAssetInfo as createAssetInfoReal
} from '@stacks/transactions'
import { PostConditionTypes } from "./constants";
import { AssetInfo, FungiblePostCondition, NonFungiblePostCondition, STXPostCondition } from "./types";

//makeStandardFungiblePostCondition
export const makeStandardFungiblePostCondition = (
    address: string,
    conditionCode: FungibleConditionCode,
    amount: string,
    assetInfo: AssetInfo
): FungiblePostCondition => {
    return new FungiblePostCondition(
        PostConditionTypes.StandardFungible,
        address,
        '',
        conditionCode,
        amount,
        assetInfo
    );
};

//makeContractFungiblePostCondition
export const makeContractFungiblePostCondition = (
    address: string,
    contractName: string,
    conditionCode: FungibleConditionCode,
    amount: string,
    assetInfo: AssetInfo
): FungiblePostCondition => {
    return new FungiblePostCondition(
        PostConditionTypes.ContractFungible,
        address,
        contractName,
        conditionCode,
        amount,
        assetInfo
    );
}

export const makeStandardSTXPostCondition = (
    address: string,
    conditionCode: FungibleConditionCode,
    amount: string,
): STXPostCondition => {
    return new STXPostCondition(
        PostConditionTypes.StandardSTX,
        address,
        '',
        conditionCode,
        amount
    );
}
export const makeContractSTXPostCondition = (
    address: string,
    contractName: string,
    conditionCode: FungibleConditionCode,
    amount: string
): STXPostCondition => {
    return new STXPostCondition(
        PostConditionTypes.ContractSTX,
        address,
        contractName,
        conditionCode,
        amount
    );
}

export const makeStandardNonFungiblePostCondition = (
    address: string,
    conditionCode: NonFungibleConditionCode,
    assetInfo: AssetInfo,
    assetName: string
): NonFungiblePostCondition => {
    return new NonFungiblePostCondition(
        PostConditionTypes.StandardNonFungible,
        address,
        '',
        conditionCode,
        assetInfo,
        assetName,
    );
}

export const makeContractNonFungiblePostCondition = (
    address: string,
    contractName: string,
    conditionCode: NonFungibleConditionCode,
    assetInfo: AssetInfo,
    assetName: string
): NonFungiblePostCondition => {
    return new NonFungiblePostCondition(
        PostConditionTypes.ContractNonFungible,
        address,
        contractName,
        conditionCode,
        assetInfo,
        assetName,
    );
}

export const createAssetInfo = (addressString: string, contractName: string, assetName: string): AssetInfo => {
    return new AssetInfo(addressString, contractName, assetName);
}

export const toRealPostCondition = (pc: FungiblePostCondition | STXPostCondition | NonFungiblePostCondition): PostCondition => {
    switch (pc.type) {
        case PostConditionTypes.StandardFungible:
            const p1 = (pc as FungiblePostCondition);
            return makeStandardFungiblePostConditionReal(
                p1.address,
                p1.conditionCode,
                p1.amount,
                createAssetInfoReal(
                    p1.assetInfo.addressString,
                    p1.assetInfo.contractName,
                    p1.assetInfo.assetName,
                ),
            );
        case PostConditionTypes.ContractFungible:
            const p2 = (pc as FungiblePostCondition);
            return makeContractFungiblePostConditionReal(
                p2.address,
                p2.contractName,
                p2.conditionCode,
                p2.amount,
                createAssetInfoReal(
                    p2.assetInfo.addressString,
                    p2.assetInfo.contractName,
                    p2.assetInfo.assetName,
                )
            );
        case PostConditionTypes.StandardSTX:
            const p3 = (pc as STXPostCondition);
            return makeStandardSTXPostConditionReal(
                p3.address,
                p3.conditionCode,
                p3.amount,
            );
        case PostConditionTypes.ContractSTX:
            const p4 = (pc as STXPostCondition);
            return makeContractSTXPostConditionReal(
                p4.address,
                p4.contractName,
                p4.conditionCode,
                p4.amount,
            );
        case PostConditionTypes.StandardNonFungible:
            const p5 = (pc as NonFungiblePostCondition);
            return makeStandardNonFungiblePostConditionReal(
                p5.address,
                p5.conditionCode,
                createAssetInfoReal(
                    p5.assetInfo.addressString,
                    p5.assetInfo.contractName,
                    p5.assetInfo.assetName,
                ),
                bufferCVFromStringReal(p5.assetName),
            );
        case PostConditionTypes.ContractNonFungible:
            const p6 = (pc as NonFungiblePostCondition);
            return makeContractNonFungiblePostConditionReal(
                p6.address,
                p6.contractName,
                p6.conditionCode,
                createAssetInfoReal(
                    p6.assetInfo.addressString,
                    p6.assetInfo.contractName,
                    p6.assetInfo.assetName,
                ),
                bufferCVFromStringReal(p6.assetName)
            );
        default:
            throw new Error(`Unknown post condition type: ${pc.type}`);
    }

}
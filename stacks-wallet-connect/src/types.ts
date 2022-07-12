import {
    FungibleConditionCode,
    NonFungibleConditionCode,
} from '@stacks/transactions'
import { PostConditionTypes  } from "./constants";

export class AssetInfo {
    addressString: string;
    contractName: string;
    assetName: string;

    constructor(addressString: string, contractName: string, assetName: string) {
        this.addressString = addressString;
        this.contractName = contractName;
        this.assetName = assetName;
    }
}

export class FungiblePostCondition {
    type: PostConditionTypes;
    address: string;
    contractName: string;
    conditionCode: FungibleConditionCode;
    amount: string;
    assetInfo: AssetInfo;

    constructor(type: PostConditionTypes, address: string, contractName: string, conditionCode: FungibleConditionCode, amount: string, assetInfo: AssetInfo) {
        this.type = type;
        this.address = address;
        this.contractName = contractName;
        this.conditionCode = conditionCode;
        this.amount = amount;
        this.assetInfo = assetInfo;
    }
}

export class STXPostCondition {
    type: PostConditionTypes;
    address: string;
    contractName: string;
    conditionCode: FungibleConditionCode;
    amount: string;

    constructor(type: PostConditionTypes, address: string, contractName: string, conditionCode: FungibleConditionCode, amount: string) {
        this.type = type;
        this.address = address;
        this.contractName = contractName;
        this.conditionCode = conditionCode;
        this.amount = amount;
    }
}

export class NonFungiblePostCondition {
    type: PostConditionTypes;
    address: string;
    contractName: string;
    conditionCode: NonFungibleConditionCode;
    assetInfo: AssetInfo;
    assetName: string;

    constructor(type: PostConditionTypes, address: string, contractName: string, conditionCode: NonFungibleConditionCode, assetInfo: AssetInfo, assetName: string) {
        this.type = type;
        this.address = address;
        this.contractName = contractName;
        this.conditionCode = conditionCode;
        this.assetInfo = assetInfo;
        this.assetName = assetName;
    }
}


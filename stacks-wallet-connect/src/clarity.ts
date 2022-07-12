import {
    BooleanCV,
    IntCV,
    UIntCV,
    BufferCV,
    NoneCV,
    StandardPrincipalCV,
    ContractPrincipalCV,
    StringAsciiCV,
    StringUtf8CV,
    // OptionalCV,
    // ListCV,
    // TupleCV,
    // ResponseErrorCV,
    // ResponseOkCV,

    trueCV as trueCVReal,
    falseCV as falseCVReal,
    intCV as intCVReal,
    uintCV as uintCVReal,
    bufferCV as bufferCVReal,
    noneCV as noneCVReal,
    // someCV as someCVReal,
    // responseOkCV as responseOkCVReal,
    // responseErrorCV as responseErrorCVReal,
    standardPrincipalCV as standardPrincipalCVReal,
    contractPrincipalCV as contractPrincipalCVReal,
    // listCV as listCVReal,
    // tupleCV as tupleCVReal,
    stringAsciiCV as stringAsciiCVReal,
    stringUtf8CV as stringUtf8CVReal,

} from '@stacks/transactions'
import { Buffer } from '@stacks/common';

export class CV {
    type: string;
    value: string;

    constructor(type: string, value: string) {
        this.type = type;
        this.value = value;
    }
}

export const toRealCV = (val: CV): BooleanCV | IntCV | UIntCV | BufferCV | NoneCV | StandardPrincipalCV | ContractPrincipalCV | StringAsciiCV | StringUtf8CV => {
    switch (val.type) {
        case 'true':
            return trueCVReal();
        case 'false':
            return falseCVReal();
        case 'int':
            return intCVReal(val.value);
        case 'uint':
            return uintCVReal(val.value);
        case 'buffer':
            return bufferCVReal(Buffer.from(val.value));
        case 'none':
            return noneCVReal();
        // case 'some':
        //     return someCVReal(val.value);
        // case 'responseOk':
        //     return responseOkCVReal(val.value);
        // case 'responseError':
        //     return responseErrorCVReal(val.value);
        case 'standardPrincipal':
            return standardPrincipalCVReal(val.value);
        case 'contractPrincipal':
            const pts = val.value.split('#');
            return contractPrincipalCVReal(pts[0], pts[1]);
        // case 'list':
        //     return listCVReal(val.value);
        // case 'tuple':
        //     return tupleCVReal(val.value);
        case 'stringAscii':
            return stringAsciiCVReal(val.value);
        case 'stringUtf8':
            return stringUtf8CVReal(val.value);
        default:
            throw new Error(`Unrecognized CV type: ${val.type}`);
    }
}

export const trueCV = (): CV => {
    return new CV('true', '');
};
export const falseCV = (): CV => {
    return new CV('false', '');
};
export const intCV = (val: string): CV => {
    return new CV('int', val);
};
export const uintCV = (val: string): CV => {
    return new CV('uint', val);
};
export const bufferCV = (val: string): CV => {
    return new CV('buffer', val);
};
export const noneCV = (): CV => {
    return new CV('none', '');
};
// export const someCV = (val: string): CV => {
//     return new CV('some', val);
// };
// export const responseOkCV = (val: string): CV => {
//     return new CV('responseOk', val);
// };
// export const responseErrorCV = (val: string): CV => {
//     return new CV('responseError', val);
// };
export const standardPrincipalCV = (val: string): CV => {
    return new CV('standardPrincipal', val);
};
export const contractPrincipalCV = (addressString: string, contractName: string): CV => {
    return new CV('contractPrincipal', `${addressString}#${contractName}`);
};
// export const listCV = (val: string): CV => {
//     return new CV('list', val);
// };
// export const tupleCV = (val: string): CV => {
//     return new CV('tuple', val);
// };
export const stringAsciiCV = (val: string): CV => {
    return new CV('stringAscii', val);
};
export const stringUtf8CV = (val: string): CV => {
    return new CV('stringUtf8', val);
};
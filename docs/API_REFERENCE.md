# Stacks JSON RPC Methods

## Contract Function Call

### Method:
`stacks_contractCall`

Request a Stacks contract function call. 


### Parameters:

**`pubkey`** _required_ - `string`

The stacks address of sender.

**`contractAddress`** _required_ - `string`

The STX address of the contract.

**`contractName`** _required_ - `string`

The name of the contract.

**`functionName`** _required_ - `string`

The name of the contract function to be called.

**`functionArgs`** _required_ - `Array<ClarityValue>`

An array of function arguments of ClarityValue type.

**`postConditions`** _optional_ - `Array<PostCondition>`

An array of post conditions to attach to the transaction.

**`postConditionMode`** _optional_ - `PostConditionMode`

The post condition mode to use. Defaults to `PostConditionMode.Allow`.

**`anchorMode`** _optional_ - `AnchorMode`

The anchor mode to use. Defaults to `AnchorMode.Any`.

**`nonce`** _optional_ - `BigInt`

Custom nonce to set for the transaction. Default value is the next nonce for the address.

**`version`** _optional_ - `string`

Version of parameter format.


### Example:

```javascript
const result = await client.request({
  chainId: "stacks:1", 
  topic: session.topic, // Get this from the session approval
  request: {
    method: "stacks_contractCall",
    params: {
      pubkey: address, 
      postConditions,
      contractAddress: "SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R",
      contractName: "my_contract_name",
      functionName: "transfer",
      functionArgs: [
        uintCV("123"),
        standardPrincipalCV("SP1BEEN4WP9YT42PR70FYSG6C3WFG54QJDEN0KWR"),
        standardPrincipalCV("SP3F7GQ48JY59521DZEE6KABHBF4Q33PEYJ823ZXQ"),
        noneCV(),
      ],
      postConditionMode: PostConditionMode.Deny,
      version: "1",
    },
  },
});
```


## STX Token Transfer

### Method: 
`stacks_stxTransfer`

Request a transfer of STX tokens.


### Parameters:

**`pubkey`** _required_ - `string`

The stacks address of sender.

**`recipient`** _required_ - `string`

The STX address of the recipient.

**`amount`** _required_ - `BigInt`

Amount of STX tokens to transfer in microstacks.

**`memo`** _optional_ - `string`

Memo string to be included with the transfer transaction.

**`postConditions`** _optional_ - `Array<PostCondition>`

An array of post conditions to attach to the transaction.

**`postConditionMode`** _optional_ - `PostConditionMode`

The post condition mode to use. Defaults to `PostConditionMode.Allow`.

**`version`** _optional_ - `string`

Version of parameter format.


### Example:

```javascript
const result = await client.request({
  chainId: chain,
  topic: session.topic,
  request: {
    method: "stacks_stxTransfer",
    params: {
      pubkey: address, 
      recipient: "SP3F7GQ48JY59521DZEE6KABHBF4Q33PEYJ823ZXQ",
      amount: 1000,
    },
  },
});
```


## Message Signing

### Method: 
`stacks_signMessage`

Request signing of an arbitrary message.


### Parameters:

**`pubkey`** _required_ - `string`

The stacks address of sender.

**`message`** _required_ - `string`

Message payload to be signed.

**`version`** _optional_ - `string`

Version of parameter format.


### Example:

```javascript
const result = await client.request({
  chainId: chain,
  topic: session.topic,
  request: {
    method: "stacks_signMessage",
    params: {
      pubkey: address,
      message: "loremipsum",
    },
  },
});
```


## Contract Deploy

### Method:
`stacks_contractDeploy`

Request a Clarity contract deployment


### Parameters:

**`pubkey`** _required_ - `string`

The stacks address of sender.

**`contractName`** _required_ - `string`

The name the contract is to be deployed as.

**`codeBody`** _required_ - `string`

Body of the contract source code.

**`postConditions`** _optional_ - `Array<PostCondition>`

An array of post conditions to attach to the transaction.

**`postConditionMode`** _optional_ - `PostConditionMode`

The post condition mode to use. Defaults to `PostConditionMode.Allow`.

**`version`** _optional_ - `string`

Version of parameter format.


### Example:

```javascript
const codeBody = `
  ;; hello-world
  (define-read-only (echo-number (val int)) (ok val))
  (define-public (say-hi) (ok "hello world"))
`

const result = await client.request({
  chainId: chain,
  topic: session.topic,
  request: {
    method: "stacks_contractDeploy",
    params: {
      pubkey: address, 
      contractName: "my_contract_name_1", 
      codeBody: codeBody,
      postConditionMode: PostConditionMode.Allow,
    },
  },
});
```

Wallet Connect v2.0-rc for Stacks 
=================================

The goal of this tutorial is to show the **minimal** approach to connect Wallet Connect (and Stacks) with your app.

We won't be introducing "best practices" or anything "complicated" - just a single component with all that's necessary :)

We'll take you through these steps:

1. Create React app and remove unnecessary stuff
3. Create Wallet Connect client
4. Establish Wallet Connect Session
5. Make some [Wallet](../wallet/README.md) calls via Wallet Connect

# Create React app and remove unnecessary stuff

1. Create a React project

    ```sh
    npx create-react-app webapp
    cd webapp
    yarn start
    ```

2. Clear the contents of `src/App.css` - remove everything, leave empty file.

3. Remove everything "unnecessary" from `src/App.js`, the end result should look like this:

    ```javascript
    import './App.css';

    function App() {
        return (
                <div>foo</div>
            );
        }

    export default App;
    ```

# Create Wallet Connect client

1. Install WalletConnect

    ```sh
    yarn add @walletconnect/utils@2.0.0-rc.2
    yarn add @walletconnect/types@2.0.0-rc.2
    yarn add @walletconnect/sign-client@2.0.0-rc.2
    yarn add @walletconnect/encoding@^1.0.1
    yarn add @walletconnect/qrcode-modal@^1.7.8
    ```

2. Setup Wallet Conenct client

    We want to store the Client "globally" and set it up as soon as possible, so:

    Open `src/App.js` and import dependencies:

    ```javascript
   	import { useState, useEffect } from 'react';
    import Client from "@walletconnect/sign-client";
    ```

    Add local state variable to `App` component like this:

    ```javascript
    ...
    function App() {
      const [ client, setClient ] = useState(undefined);
    ...
    ```

    Now use effect hook to initialize the Client:

    ```javascript
    useEffect(() => {
        const f = async () => {
            const c = await Client.init({
                logger: 'debug',
                relayUrl: 'wss://relay.walletconnect.com',
                projectId: 'yourProjectID', // register at WalletConnect and create one for yourself - https://cloud.walletconnect.com/
                metadata: {
                    name: "WalletConnect with Stacks",
                    description: "WalletConnect & Stacks",
                    url: "https://walletconnect.com/",
                    icons: ["https://avatars.githubusercontent.com/u/37784886"],
                },
            });

            setClient(c);
        }

        if (client === undefined) {
            f();
        }
    }, [client]);
    ```

# Establish Wallet Connect Session

We have the Client ready, nowe we need to connect our app to our wallet - establish a Session.

We do that by providing selected Network's `chainID` to Wallet Connect client.

1. Find your network(-s) `chainID` on [ChainList](https://chainlist.org/) and/or [CAIP-APIP](https://github.com/pedrouid/caip-api/blob/master/src/config/)

    ChainID is in a form of a string containing network name and a number, ex. `foo:123`. You can find both on ChainLink and CAIP-API.

    In case of Stacks, the chain IDs you're interested in are:

    ```
    # Mainnet
    "stacks:1"

    #Testnet
    "stacks:2147483648"
    ```

    Add it to `src/App.js` after the imports:

    ```javascript
    const chains = [
        'stacks:1',
        'stacks:2147483648',
    ];
    ```

2. Create local state that will hold our selected Chain and our Session:

    ```javascript
    const [ chain, setChain ] = useState(undefined);
    const [ session, setSession ] = useState(undefined);
    ```

3. Add empty connection handler:

    ```javascript
    const handleConnect = async (chain) => {};
    ```

3. Handle our Networks (chainIDs) in UI:

    Replace the `return` of our App component like this:

    ```javascript
    return (
        <div className="main">
            <h1>Wallet Connect with Stacks</h1>

            {
                !session && (
                <div className="box">
                    <h3>Select chain:</h3>
                    {chains.map((c, idx) => {
                        return (<div key={`chain-${idx}`}>{c} <button disabled={!client} onClick={async () => await handleConnect(c)}>connect</button></div>);
                    })}
                </div>
                )
            }
        </div>
    );
    ```

4. Make it questionably prettier, replace `src/App.css` with:

    ```css
    .main {
        margin: auto;
        width: 75%;
    }

    .box {
        background: #ff5fb7;
        padding: 0.5rem 1rem;
        margin: 0 0 1rem 0;
    }

    .box.code {
        background: lightslategray;
        overflow: scroll;
    }

    .box h3 {
        margin: 0.3rem 0;
    }

    button {
        margin: 0.3rem;
    }
    ```

5. Handle connection, edit the `handleConnect` function:

    Reset any previously set chains with:

    ```javascript
    setChain(undefined);
    ```

    Prior to connecting our app with the wallet, we need to know a couple of things:
    - what are the supported methods?
    - what are the supported events?
    - what are the supported chains?

    Chains are simple - it's Stacks, so we simply pass the selected chain (full chainID).
    Events and methods are wallet dependant.

    [Our dummy wallet](../wallet/README.md) doesn't support events and supports only 4 example methods:

    - stacks_signMessage - for signing a message with wallet users private key
    - stacks_stxTransfer - simple STX transfer
    - stacks_contractCall - contract call (with post conditions)
    - stacks_contractDeploy - contract deploy

    We pass these method names as array and keep `events` empty - depending on the wallet, the names MAY (and most likely WILL) be different! They must match what the wallet supports.

    In our case it looks like this:

    ```javascript
    const { uri, approval } = await client.connect({
      pairingTopic: undefined,
      requiredNamespaces: {
        "stacks":{
          "methods":[
            'stacks_signMessage',
            'stacks_stxTransfer',
            'stacks_contractCall',
            'stacks_contractDeploy',
          ],
          "chains":[
            chain
          ],
          "events":[]
        }
      },
    });
    ```

    We can use the returned `uri` directly, but it's easier (preferred) to use Wallet Connect QR Code modal to establish connection:

    Import the QRCodeModal:

    ```javascript
    import QRCodeModal from "@walletconnect/qrcode-modal";
    ```

    And handle it in `handleConnect`:

    ```javascript
    if (uri) {
      QRCodeModal.open(uri, () => {
        console.log("QR Code Modal closed");
      });
    }
    ```

    Wait for the wallet to approve your app, save the session, chain, close the modal:

    ```javascript
    const session = await approval();
    setSession(session);
    setChain(chain);

    QRCodeModal.close();
    ```

    The full `handleConnect` should look like this:

    ```javascript
    const handleConnect = async (chain) => {
        setChain(undefined);

        const { uri, approval } = await client.connect({
            pairingTopic: undefined,
            requiredNamespaces: {
                "stacks":{
                "methods":[
                    'stacks_signMessage',
                    'stacks_stxTransfer',
                    'stacks_contractCall',
                    'stacks_contractDeploy',
                ],
                "chains":[
                    chain
                ],
                "events":[]
                }
            },
        });

        if (uri) {
        QRCodeModal.open(uri, () => {
            console.log("QR Code Modal closed");
        });
        }

        const session = await approval();
        setSession(session);
        setChain(chain);

        QRCodeModal.close();
    };
    ```

# Make some [Wallet](../wallet/README.md) calls via Wallet Connect

At this point, when you click `connect` - you should be presented with Wallet Connect QR Code modal.

If you scan the qr code with our example Wallet, it'll show the list of methods we've passed. Approve it and you'll see the `connect` buttons go away - indicatin there's nothing to connect to anymore.

1. Show available methods, add this to `src/App.js` render method:

    ```javascript
    {
        session && (
            <div className="box">
                <h3>Wallet connected!</h3>
                <div><button onClick={async () => await handleSignMessage()}>Sign Message</button></div>
                <div><button onClick={async () => await handleTransferSTX()}>Transfer STX</button></div>
                <div><button onClick={async () => await handleContractCall()}>Call Contract</button></div>
                <div><button onClick={async () => await handleContractDeploy()}>Deploy Contract</button></div>
            </div>
        )
    }
    ```

2. Add the missing handlers:

    ```javascript
    const handleSignMessage = async () => {};
    const handleContractDeploy = async () => {};
    const handleTransferSTX = async () => {};
    const handleContractCall = async () => {};
    ```

    We'll cover each handler individually building up complexity.
    
    You can read more about available Stacks transactions [here](https://github.com/stacks-network/stacks-transactions-js).

3. A little theory:

    Wallet Connect acts as RPC layer between our App and the Wallet.

    The Wallet defines RPC protocol (methods, events, etc.) and performs all of the operations.

    The App is just a client and simply sends some requests.

    So - everything we do is RPC-like request that goes through "rpc client" like this:

    ```javascript
    const request = {
        method: 'stacks_signMessage', //here you provide the method you want to use
        params: { //and here you pass the arguments
            pubkey: address, //XXX: This one is required
            message, //this is our custom payload
        },
    };
    await client.request({
        chainId: chain, //ex. stacks:1
        topic: session.topic, //taken from session object
        request,
    });
    ```

    The `request` itself is heavily dependant on what Wallet requires from us!

    We'll also need an `address` and we can get it from the `session` like this:

    ```javascript
    const address = session.namespaces.stacks.accounts[0].split(':')[2];
    ```

    Another thing is Walelt Connect as a communication layer has some limitations we have to deal with - it uses JSON serialization...and because of that: works most of the times, except for `Stacks CV values` that uses `bigint` :)

    For that reason we need a hack, add this to your `src/App.js` (after imports):

    ```javascript
    /* global BigInt */

    BigInt.prototype.toJSON = function() { return this.toString() }
    ```

    If you use TypeScript, you can do it like this:

    ```javascript
    (BigInt.prototype as any).toJSON = function () {
        return this.toString();
    };
    ```

4. Add some prerequisites:

    Import Stacks dependencies:

    ```javascript
    import {
        PostConditionMode,
        FungibleConditionCode,
        uintCV,
        noneCV,
        standardPrincipalCV,
        createAssetInfo,
        makeStandardFungiblePostCondition,
    } from '@stacks/transactions';
    ```

    Set up results box, add this to our `src/App.js`:

    Result state in the beginning:

    ```javascript
    const [ result, setResult ] = useState(undefined);
    ```

    And render part:

    ```javascript
    {
        result && (
          <div className="box code">
            <pre>{JSON.stringify(result, '  ', '  ')}</pre>
          </div>
        )
    }
    ```

5. Sign Message:

    The idea is that we send a `message` to the wallet and it sends back a cryptographic `signature` (signs our `message` with a `private key`).

    Our dummy wallet implements it in a super basic form - it simply adds `+SIGNED` to the `message`.

    Edit `handleSignMessage` function and set it's contents to:

    ```javascript
    const handleSignMessage = async () => {
        const address = session.namespaces.stacks.accounts[0].split(':')[2];

        try {
            const message = 'loremipsum';

            const result = await client.request({
                chainId: chain,
                topic: session.topic,
                request: {
                    method: 'stacks_signMessage',
                    params: {
                        pubkey: address, //XXX: This one is required
                        message,
                    },
                },
            });

            //dummy check of signature
            const valid = result.signature === message + '+SIGNED';

            setResult({
                method: 'stacks_signMessage',
                address,
                valid,
                result: result.signature,
            });
        } catch (error) {
            throw new Error(error);
        }
    };
    ```

    Connect your wallet and test it :)

    W're trying to mimic Stacks APIs as much as possible, so looking into [this](https://github.com/stacks-network/stacks-transactions-js) should give you a pretty good idea on how to create any other calls yourself!

6. Contract Deploy:

    Take Contract Deploy for example - there's not much difference! You just specify "RPC method" to call and pass some parameters et voilà!

    ```javascript
    const handleContractDeploy = async () => {
        const address = session.namespaces.stacks.accounts[0].split(':')[2];

        try {
            const result = await client.request({
                chainId: chain,
                topic: session.topic,
                request: {
                    method: 'stacks_contractDeploy',
                    params: {
                        pubkey: address, //XXX: This one is required
                        contractName: 'my_contract_name_3', //XXX: CHange the contract name!
                        codeBody: `
    ;; hello-world
    ;; <add a description here>
    ;; constants
    ;;
    ;; data maps and vars
    ;;
    ;; private functions
    ;;
    (define-read-only (echo-number (val int)) (ok val))
    ;; public functions
    ;;
    (define-public (say-hi) (ok "hello world"))
                        `,
                        postConditionMode: PostConditionMode.Allow,
                    },
                },
            });

            setResult({
                method: 'stacks_contractDeploy',
                address,
                valid: true,
                result: result.txId,
            });
        } catch (error) {
            throw new Error(error);
        }
    };
    ```

7. Transfer STX:

    Can you can see the pattern? :D

    ```javascript
    const handleTransferSTX = async () => {
        const address = session.namespaces.stacks.accounts[0].split(':')[2];

        try {
            const result = await client.request({
                chainId: chain,
                topic: session.topic,
                request: {
                    method: 'stacks_stxTransfer',
                    params: {
                        pubkey: address, //XXX: This one is required
                        recipient: 'ST3Q85SVTW7J3XQ38V7V88653YN90728NMM46J2ZE',
                        amount: 12,
                    },
                },
            });

            setResult({
                method: 'stacks_stxTransfer',
                address,
                valid: true,
                result: result.txId,
            });
        } catch (error) {
            throw new Error(error);
        }
    };
    ```

8. Contract Call:

    Calling a contract method is slightly more elaborate, but it's only due to the fact we want to provide Stacks `PostConditions`.

    Luckily, thanks to the `BigInt` defined hacks above - we can use Stacks libraries to build the transaction as we normally would.

    In our case we want to `transfer` some fake `MiamiCoin` tokens.

    First we figure out contract related details, like the contract's name and account address. We also need the token's name - it's hidden in the contract's code (you can see it through explorer).
    
    Then we build the `PostConditions` array - we want it to `transfer exactly 13 tokens` (our "order amount").

    The last thing is to simply combine it all and pass as `request`.

    ```javascript
    const handleContractCall = async () => {
        const address = session.namespaces.stacks.accounts[0].split(':')[2];

        const contract = 'ST24YYAWQ4DK4RKCKK1RP4PX0X5SCSXTWQXFGVCVY.fake-miamicoin-token-V2';
        const [ contractAddress, contractName ] = contract.split('.');
        const tokenName = 'miamicoin'; //XXX: It's hidden in the contract's code but it's not hard to find.

        const orderAmount = 13 * 10**6; //13 miamicoin
        const addressTo = 'ST3Q85SVTW7J3XQ38V7V88653YN90728NMM46J2ZE';

        // Define post conditions
        const postConditions = [];
        postConditions.push(
            makeStandardFungiblePostCondition(
                address,
                FungibleConditionCode.Equal,
                orderAmount.toString(),
                createAssetInfo(
                    contractAddress,
                    contractName,
                    tokenName
                )
            )
        );

        try {
            const result = await client.request({
                chainId: chain,
                topic: session.topic,
                request: {
                    method: 'stacks_contractCall',
                    params: {
                        pubkey: address, //XXX: This one is required
                        postConditions,
                        contractAddress: contractAddress,
                        contractName: contractName,
                        functionName: 'transfer',
                        functionArgs: [
                            uintCV(orderAmount.toString()),
                            standardPrincipalCV(address),
                            standardPrincipalCV(addressTo),
                            noneCV(),
                        ],
                        postConditionMode: PostConditionMode.Deny,
                        version: '1'
                    },
                },
            });

            setResult({
                method: 'stacks_contractCall',
                address,
                valid: true,
                result: result.txId,
            });
        } catch (error) {
            throw new Error(error);
        }
    };
    ```

That's it - you can now:
- connect to your Stacks wallet through Wallet Connect
- sign a message
- transfer STX
- deploy a contract
- call a contract

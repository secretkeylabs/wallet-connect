import { useState, useEffect } from 'react';
import Client from "@walletconnect/sign-client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {
  PostConditionMode,
  FungibleConditionCode,
  uintCV,
  noneCV,
  standardPrincipalCV,
  cvToHex,
  createAssetInfo
} from '@stacks/transactions'
import './App.css';

const chains = [
    'stacks:1',
    'stacks:2147483648',
];

// BigInt.prototype.toJSON = function() { return this.toString()  };

function App() {
  const [ client, setClient ] = useState(undefined);
  const [ session, setSession ] = useState(undefined);
  const [ chain, setChain ] = useState(undefined);
  const [ result, setResult ] = useState(undefined);

  useEffect(() => {
    const f = async () => {
      const c = await Client.init({
        logger: 'debug',
        relayUrl: 'wss://relay.walletconnect.com',
        projectId: 'someProjectID',
        metadata: {
          name: "WalletConnect with Stacks",
          description: "WalletConnect & Stacks",
          url: "https://walletconnect.com/",
          icons: ["https://avatars.githubusercontent.com/u/37784886"],
        },
      });
      console.log('client: ', c);

      setClient(c);
    }

    if (client === undefined) {
      f();
    }
  }, [client]);

  const handleConnect = async (chain) => {
    setChain(undefined);

    const { uri, approval } = await client.connect({
      pairingTopic: undefined,
      requiredNamespaces: {
        "stacks":{
          "methods":[
            'stacks_stxTransfer',
            'stacks_contractCall',
            'stacks_signMessage',
          ],
          "chains":[
            chain
          ],
          "events":[]
        }
      },
    });
    console.log('URI: ', uri);

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

  const handleContractCall = async () => {
    const address = session.namespaces.stacks.accounts[0].split(':')[2];

    const contract = 'ST24YYAWQ4DK4RKCKK1RP4PX0X5SCSXTWQXFGVCVY.fake-miamicoin-token-V2';
    const [ contractAddress, contractName ] = contract.split('.');
    const tokenName = 'miamicoin'; //XXX: It's hidden in the contract's code but it's not hard to find.

    const orderAmount = 13 * 10**6; //13 miamicoin
    const addressTo = 'ST3Q85SVTW7J3XQ38V7V88653YN90728NMM46J2ZE';

    // Define post conditions
    const postConditions = [];
    postConditions.push({
      function: 'makeStandardFungiblePostCondition',
      functionArgs: [
        address,
        FungibleConditionCode.Equal,
        orderAmount.toString(),
        createAssetInfo(
          contractAddress,
          contractName,
          tokenName
        )
      ]
    })

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
              cvToHex(uintCV(orderAmount.toString())),
              cvToHex(standardPrincipalCV(address)),
              cvToHex(standardPrincipalCV(addressTo)),
              cvToHex(noneCV()),
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

  return (
    <div class="main">
      <h1>Wallet Connect with Stacks</h1>

      {
        !session && (
          <div class="box">
            <h3>Select chain:</h3>
            {chains.map((c, idx) => {
              return (<div key={`chain-${idx}`}>{c} <button disabled={!client} onClick={async () => await handleConnect(c)}>connect</button></div>);
            })}
          </div>
        )
      }

      {
        session && (
          <div class="box">
            <h3>Wallet connected!</h3>
            <div><button onClick={async () => await handleTransferSTX()}>Transfer STX</button></div>
            <div><button onClick={async () => await handleContractCall()}>Call Contract</button></div>
            <div><button onClick={async () => await handleSignMessage()}>Sign Message</button></div>
            <div><button onClick={async () => await handleSignMessage()}>Sign Message</button></div>
          </div>
        )
      }

      {
        result && (
          <div class="box code">
            <pre>{JSON.stringify(result, '  ', '  ')}</pre>
          </div>
        )
      }
    </div>
  );
}

export default App;

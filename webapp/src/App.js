import "./App.css";
import { useState, useEffect } from "react";
import Client from "@walletconnect/sign-client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {
  PostConditionMode,
  FungibleConditionCode,
  uintCV,
  noneCV,
  standardPrincipalCV,
  createAssetInfo,
  makeStandardFungiblePostCondition,
} from "@stacks/transactions";
import { verifyMessageSignatureRsv } from "@stacks/encryption";

/* global BigInt */

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const chains = ["stacks:1", "stacks:2147483648"];

function App() {
  const [client, setClient] = useState(undefined);
  const [chain, setChain] = useState(undefined);
  const [session, setSession] = useState(undefined);
  const [result, setResult] = useState(undefined);

  useEffect(() => {
    const f = async () => {
      const c = await Client.init({
        logger: "debug",
        // relayUrl: 'wss://relay.walletconnect.com',
        projectId: "", // register at WalletConnect and create one for yourself - https://cloud.walletconnect.com/
        // you need to have a valid ID or the app will not start
        metadata: {
          name: "WalletConnect with Stacks",
          description: "WalletConnect & Stacks",
          url: "https://walletconnect.com/",
          icons: ["https://avatars.githubusercontent.com/u/37784886"],
        },
      });

      setClient(c);
    };

    if (client === undefined) {
      f();
    }
  }, [client]);

  const handleConnect = async (chain) => {
    setChain(undefined);

    const { uri, approval } = await client.connect({
      pairingTopic: undefined,
      requiredNamespaces: {
        stacks: {
          methods: [
            "stacks_signMessage",
            "stacks_stxTransfer",
            "stacks_contractCall",
            "stacks_contractDeploy",
          ],
          chains: [chain],
          events: [],
        },
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

  const handleSignMessage = async () => {
    const address = session.namespaces.stacks.accounts[0].split(":")[2];

    try {
      const message = "loremipsum";

      const result = await client.request({
        chainId: chain,
        topic: session.topic,
        request: {
          method: "stacks_signMessage",
          params: {
            pubkey: address, //XXX: This one is required
            message,
          },
        },
      });

      const signature = result.signature;
      const valid = verifyMessageSignatureRsv({ message, address, signature });

      setResult({
        method: "stacks_signMessage",
        address,
        valid: valid,
        result: signature,
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleContractDeploy = async () => {
    const address = session.namespaces.stacks.accounts[0].split(":")[2];

    try {
      const result = await client.request({
        chainId: chain,
        topic: session.topic,
        request: {
          method: "stacks_contractDeploy",
          params: {
            pubkey: address, //XXX: This one is required
            contractName: "my_contract_name_3", //XXX: CHange the contract name!
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
        method: "stacks_contractDeploy",
        address,
        valid: true,
        result: result.txId,
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleTransferSTX = async () => {
    const address = session.namespaces.stacks.accounts[0].split(":")[2];
    const isMainnet = chain == chains[0];
    const recip = isMainnet
      ? "SPZ3SYSA0075FEB41MQR1XMC9HAGTYN2J0BE4F4E"
      : "ST3Q85SVTW7J3XQ38V7V88653YN90728NMM46J2ZE";
    try {
      const result = await client.request({
        chainId: chain,
        topic: session.topic,
        request: {
          method: "stacks_stxTransfer",
          params: {
            pubkey: address, //XXX: This one is required
            recipient: recip,
            amount: 12,
          },
        },
      });

      setResult({
        method: "stacks_stxTransfer",
        address,
        valid: true,
        result: result.txId,
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleContractCall = async () => {
    const address = session.namespaces.stacks.accounts[0].split(":")[2];

    const isMainnet = chain == chains[0];
    const contract = isMainnet
      ? "SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-token-v2"
      : "ST24YYAWQ4DK4RKCKK1RP4PX0X5SCSXTWQXFGVCVY.fake-miamicoin-token-V2";
    const [contractAddress, contractName] = contract.split(".");
    const tokenName = "miamicoin"; //XXX: It's hidden in the contract's code but it's not hard to find.

    const orderAmount = 13 * 10 ** 6; //13 miamicoin
    const addressTo = isMainnet
      ? "SPZ3SYSA0075FEB41MQR1XMC9HAGTYN2J0BE4F4E"
      : "ST3Q85SVTW7J3XQ38V7V88653YN90728NMM46J2ZE";

    // Define post conditions
    const postConditions = [];
    postConditions.push(
      makeStandardFungiblePostCondition(
        address,
        FungibleConditionCode.Equal,
        orderAmount.toString(),
        createAssetInfo(contractAddress, contractName, tokenName)
      )
    );

    try {
      const result = await client.request({
        chainId: chain,
        topic: session.topic,
        request: {
          method: "stacks_contractCall",
          params: {
            pubkey: address, //XXX: This one is required
            postConditions,
            contractAddress: contractAddress,
            contractName: contractName,
            functionName: "transfer",
            functionArgs: [
              uintCV(orderAmount.toString()),
              standardPrincipalCV(address),
              standardPrincipalCV(addressTo),
              noneCV(),
            ],
            postConditionMode: PostConditionMode.Deny,
            version: "1",
          },
        },
      });

      setResult({
        method: "stacks_contractCall",
        address,
        valid: true,
        result: result.txId,
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  const connect = async (c) => {
    try {
      await handleConnect(c)
    } catch(error) {
      if(error.code == 5002) { // Code for user rejected methods.
        QRCodeModal.close()
      }
    }
  }


  return (
    <div className="main">
      <h1>Wallet Connect with Stacks</h1>

      {!session && (
        <div className="box">
          <h3>Select chain:</h3>
          {chains.map((c, idx) => {
            return (
              <div key={`chain-${idx}`}>
                {c}{" "}
                <button
                  disabled={!client}
                  onClick={ 
                     async () =>  { 
                      connect(c);
                    } 
                  }
                >
                  connect
                </button>
              </div>
            );
          })}
        </div>
      )}

      {session && (
        <div className="box">
          <h3>Wallet connected!</h3>
          <div>
            <button onClick={async () => await handleSignMessage()}>
              Sign Message
            </button>
          </div>
          <div>
            <button onClick={async () => await handleTransferSTX()}>
              Transfer STX
            </button>
          </div>
          <div>
            <button onClick={async () => await handleContractCall()}>
              Call Contract
            </button>
          </div>
          <div>
            <button onClick={async () => await handleContractDeploy()}>
              Deploy Contract
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="box code">
          <pre>{JSON.stringify(result, "  ", "  ")}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

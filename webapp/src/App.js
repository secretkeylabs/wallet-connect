import "./App.css";
import { useState, useEffect } from "react";
import Client from "@walletconnect/sign-client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {
  makeStandardFungiblePostCondition,
  bufferCVFromString,
  contractPrincipalCV,
  falseCV,
  intCV,
  listCV,
  noneCV,
  responseErrorCV,
  responseOkCV,
  someCV,
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  trueCV,
  tupleCV,
  uintCV,
  PostConditionMode,
  FungibleConditionCode,
  createAssetInfo,
  serializeCV,
  deserializeCV,
} from "@stacks/transactions";
import { verifyMessageSignature, verifyMessageSignatureRsv } from "@stacks/encryption";
import {
  clearLocalStorage,
  loadFromLocalStorage,
  saveToLocalStorage,
} from "./utils";

/* global BigInt */

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const ADDRESS = "SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B";
const structuredData = tupleCV({
  a: intCV(-1),
  b: uintCV(1),
  c: bufferCVFromString("test"),
  d: trueCV(),
  e: someCV(trueCV()),
  f: noneCV(),
  g: standardPrincipalCV(ADDRESS),
  h: contractPrincipalCV(ADDRESS, "test"),
  i: responseOkCV(trueCV()),
  j: responseErrorCV(falseCV()),
  k: listCV([trueCV(), falseCV()]),
  l: tupleCV({
    a: trueCV(),
    b: falseCV(),
  }),
  m: stringAsciiCV("hello world"),
  another: tupleCV({
    a: trueCV(),
    b: falseCV(),
    deep: tupleCV({
      a: trueCV(),
      b: falseCV(),
      c: tupleCV({
        deeper: tupleCV({
          a: trueCV(),
          b: falseCV(),
          c: tupleCV({
            deeper: tupleCV({
              a: trueCV(),
              b: falseCV(),
              c: tupleCV({
                deeper: tupleCV({
                  a: trueCV(),
                  b: falseCV(),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
  n: stringUtf8CV("hello \u{1234}"),
  o: listCV([]),
});

const chains = [
  "stacks:1",
  "stacks:2147483648",
  "bip122:000000000019d6689c085ae165831e93",
  "bip122:000000000933ea01ad0ee984209779ba",
];

function App() {
  const [client, setClient] = useState(undefined);
  const [chain, setChain] = useState(undefined);
  const [session, setSession] = useState(undefined);
  const [result, setResult] = useState(undefined);

  useEffect(() => {
    const f = async () => {
      const c = await Client.init({
        logger: "debug",
        relayUrl: "wss://relay.walletconnect.com",
        projectId: "a450e71d8320703f06157f0ce4e7188a", // register at WalletConnect and create one for yourself - https://cloud.walletconnect.com/
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
    if (loadFromLocalStorage("session")) {
      setSession(loadFromLocalStorage("session"));
    }
    if (loadFromLocalStorage("chain")) {
      setChain(loadFromLocalStorage("chain"));
    }
  }, [client]);

  const handleConnect = async (chain) => {
    setChain(undefined);
    if (chain.includes("stacks")) {
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

      const sessn = await approval();
      setSession(sessn);
      setChain(chain);
      saveToLocalStorage("session", sessn);
      saveToLocalStorage("chain", chain);
      QRCodeModal.close();
    } else {
      const { uri, approval } = await client.connect({
        pairingTopic: undefined,
        requiredNamespaces: {
          bip122: {
            methods: ["bitcoin_btcTransfer"],
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

      const sessn = await approval();
      setSession(sessn);
      setChain(chain);
      saveToLocalStorage("session", sessn);
      saveToLocalStorage("chain", chain);
      QRCodeModal.close();
    }
  };

  /**
   * send a BTC transaction request with multiple recipients support
   * recipients are passed as an array of objects containing address and amount in sats
   */
  const handleBtcTransfer = async () => {
    try {
      const address = session.namespaces.bip122.accounts[0].split(":")[2];
      const isMainnet = chain == chains[2];
      // pass the recipients in an array
      const recipients = isMainnet
        ? [
            {
              address: "3DP8pe2zJUcBezD35cLyZJGdbDwNYwBNtb",
              amountSats: "6000",
            },
            {
              address: "3Codr66EYyhkhWy1o2RLmrER7TaaHmtrZe",
              amountSats: "7000",
            },
          ]
        : [
            {
              address: "2NAm1LPPHQQ8AaLhXSYWrpApoCKcyjNJsjf",
              amountSats: "6000",
            },
            {
              address: "2Mx1h4VWiik8JNosa5nu4Gg96iPNQPJBWGa",
              amountSats: "7000",
            },
           
          ];

      const result = await client.request({
        chainId: chain,
        topic: session.topic,
        request: {
          method: "bitcoin_btcTransfer",
          params: {
            pubkey: address, //XXX: This one is required
            recipients,
          },
        },
      });

      setResult({
        method: "bitcoin_btcTransfer",
        address,
        valid: true,
        result: result,
      });
    } catch (e) {
      throw new Error(e);
    }
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

      const publicKey = result.publicKey;
      const signature = result.signature;
      const valid = verifyMessageSignatureRsv({
        message,
        publicKey,
        signature,
      });

      setResult({
        method: "stacks_signMessage",
        address,
        valid,
        result,
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleStructuredMessage = async () => {
    const address = session.namespaces.stacks.accounts[0].split(":")[2];
    const domain = "0c0000000308636861696e2d69640100000000000000000000000000000001046e616d650d00000011414c4558204232302050726f746f636f6c0776657273696f6e0d00000005302e302e31";
    try {
     const structuredMessage = serializeCV(structuredData);
      const result = await client.request({
        chainId: chain,
        topic: session.topic,
        request: {
          method: "stacks_signMessage",
          params: {
            pubkey: address, //XXX: This one is required
            message: structuredMessage,
            domain
          },
        },
      });

      setResult({
        method: "stacks_signMessage",
        address,
        result,
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
        result: result,
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleTransferSTX = async () => {
    const address = session.namespaces.stacks.accounts[0].split(":")[2];
    const isMainnet = chain == chains[0];
    const recip = isMainnet
      ? "SP34AVN2XCNQKYKR4KB3M1NGD6ECMHFDSWM42517E"
      : "ST34AVN2XCNQKYKR4KB3M1NGD6ECMHFDSWN439CGE";
    try {
      const result = await client.request({
        chainId: chain,
        topic: session.topic,
        request: {
          method: "stacks_stxTransfer",
          params: {
            pubkey: address, //XXX: This one is required
            recipient: recip,
            amount: BigInt(1000),
            memo: "example transfer",
          },
        },
      });

      setResult({
        method: "stacks_stxTransfer",
        address,
        valid: true,
        result,
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
      ? "SP34AVN2XCNQKYKR4KB3M1NGD6ECMHFDSWM42517E"
      : "ST34AVN2XCNQKYKR4KB3M1NGD6ECMHFDSWN439CGE";

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
    const sponsored = false;

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
            sponsored,
          },
        },
      });

      setResult({
        method: "stacks_contractCall",
        address,
        valid: true,
        result,
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  const disconnect = async () => {
    clearLocalStorage();
    await client.pairing.delete(session.topic, {
      code: 100,
      message: "deleting",
    });
    setSession(undefined);
    setChain(undefined);
  };

  const connect = async (c) => {
    try {
      await handleConnect(c);
    } catch (error) {
      if (error.code == 5002) {
        // Code for user rejected methods.
        QRCodeModal.close();
      }
    }
  };

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
                  onClick={async () => {
                    connect(c);
                  }}
                >
                  connect
                </button>
              </div>
            );
          })}
        </div>
      )}

      {session && session.namespaces.stacks && (
        <div className="box">
          <h3>Wallet connected!</h3>
          <div>
            <button onClick={async () => await handleSignMessage()}>
              Sign Message
            </button>
            <button onClick={async () => await handleStructuredMessage()}>
              Sign Structured Message
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
          <div>
            <button onClick={async () => disconnect()}>Disconnect</button>
          </div>
        </div>
      )}

      {session && session.namespaces.bip122 && (
        <div className="box">
          <h3>Wallet connected!</h3>
          <div>
            <button onClick={async () => await handleBtcTransfer()}>
              Transfer btc
            </button>
          </div>
          <div>
            <button onClick={async () => disconnect()}>Disconnect</button>
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

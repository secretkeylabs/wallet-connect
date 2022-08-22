Wallet Connect for Stacks 
=========================

> **IMPORTANT:** Use **node v16.x** - current node version on Mac is **v18.x**, but it introduces breaking changes!

This repo contains instructions on how to add Wallet Connect support to your app and connect it with Stacks wallet (thourh Stacks.js API).

The repo contains of 3 things that should be ready to run:

1. [Wallet](/wallet/README.md) - react app that simulates a wallet - modified to support Stacks

    Original repo: [https://github.com/WalletConnect/web-examples/tree/main/wallets/react-wallet-v2](https://github.com/WalletConnect/web-examples/tree/main/wallets/react-wallet-v2)

2. [Web App](/webapp/README.md) - react app that we implement the Wallet Connect to.

    This is a pure Create React App project that starts from "zero" to what's in the repo - see the [README.md](/webapp/README.md) file!

3. [Stacks Wallet Connect](/stacks-wallet-connect/README.md) - helper functions and constants used in the wallet itself - we'll probably get rid of it so don't get too attached to it ;)

# Setup

1. Clone the repo (obviously)
2. Insall dependencies in all 3 directories

        cd wallet/webapp/stacks-wallet-connect
        yarn

3. Create linkable `@web3devs/stacks-wallet-connect` package

        cd stacks-wallet-connect
        yarn build
        yarn link

4. Link the package in **wallet**

        cd wallet
        yarn link @web3devs/stacks-wallet-connect

5. Starting the development environment

        cd webapp
        yarn start
        cd ..
        cd wallet
        yarn dev

6. Read the [WebApp README](/webapp/README.md)!
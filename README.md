Stacks Wallet Connect
=====================

# Apps

1. Wallet - react app that simulates a wallet
2. Web App - react app that we implement the Wallet Connect to
3. Stacks Wallet Connect - stacks provider for Wallet Connect

# Wiring it all together

    cd stacks-wallet-connect
    npm link
    cd ..

    cd webapp
    cp .env.local.example .env.local
    yarn
    npm link @web3devs/stacks-provider

# Starting environment

    cd webapp
    npm start
    cd ..

    cd wallet
    npm dev

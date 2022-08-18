Wallet Connect v2.0-rc for Stacks 
=================================

The goal of this tutorial is to show the **minimal** approach to connect Wallet Connect (and Stacks) with your app.

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

4. Install WalletConnect

    ```sh
    yarn add @walletconnect/utils@2.0.0-rc.2
    yarn add @walletconnect/types@2.0.0-rc.2
    yarn add @walletconnect/sign-client@2.0.0-rc.2
    yarn add @walletconnect/encoding@^1.0.1
    yarn add @walletconnect/qrcode-modal@^1.7.8
    ```

5. Find your network(-s) `chainID` on [ChainList](https://chainlist.org/) and/or [CAIP-APIP](https://github.com/pedrouid/caip-api/blob/master/src/config/)

    You need your network's chainID. It's generaly in a form of a string containing network name and a number, ex. `foo:123`. You can find both on ChainLink and CAIP-API.

    In case of Stacks, the chain IDs you're interested in are:

    ```
    # Mainnet
    "stacks:1"

    #Testnet
    "stacks:2147483648"
    ```

6. 
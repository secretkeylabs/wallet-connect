# Introduction

[WalletConnect](https://walletconnect.com/) is a popular web3 standard to connect blockchain wallets to dApps. WalletConnect creates a secure encrypted connection between apps and wallets via a relay server. The connected clients can be on any platform as long as they have an internet connection. This means an app running on a desktop browser can request a connection to a mobile wallet without the devices being physically connected. To learn more about the WalletConnect protocol visit their [documentation page](https://docs.walletconnect.com/2.0/).

[Xverse wallet](https://www.xverse.app/) is a Bitcoin wallet for web3 powered by [Stacks](https://www.stacks.co/). It supports signing of all Stacks authentication and transaction requests via WalletConnect in addition to the native [Stacks Connect](https://github.com/hirosystems/connect) methods. It also supports Bitcoin transactions request. WalletConnect is currently supported by Xverse wallet on [iOS](https://apps.apple.com/us/app/xverse-bitcoin-web3-wallet/id1552272513) and [Android](https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse\&hl=en\&gl=US).

These documentation pages will provide a quick start guide to integrating WalletConnect for Stacks in your application and a reference for the JSON API. A complete example with a web application and dummy wallet implementation is also provided.

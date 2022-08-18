import Client from "@walletconnect/sign-client";
import QRCodeModal from "@walletconnect/qrcode-modal";

const chains = [
    'stacks:1',
    'stacks:2147483648',
];

const handleConnect = async (chain) => {
    const [name, chainID] = chain.split(':');

    console.log('Name: ', name);
    console.log('ChainID: ', chainID);

    const _client = await Client.init({
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
    console.log('client: ', _client);

    const requiredNamespaces = {
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
    };
    console.log('Required namespaces: ', requiredNamespaces);
    const { uri, approval } = await _client.connect({
        pairingTopic: undefined,
        requiredNamespaces,
    });

    console.log('URL: ', uri);
    console.log('Approval: ', approval);

    if (uri) {
        QRCodeModal.open(uri, () => {
            console.log("EVENT", "QR Code Modal closed");
        });
    }
};

const ChainsList = () => {
    return <>{chains.map(c => {
        const [name] = c.split(':');

        return (<div>{name} <button onClick={async () => await handleConnect(c)}>connect</button></div>);
    })}</>;
}

export default ChainsList;
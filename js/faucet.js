
import { ethers } from "/dist/ethers-5.6.esm.min.js";

let conf;

const TOKEN_NAME = 'PoW';
const TOKEN_SYMBOL = 'PoW';

let CHAIN_ID;
let CHAIN_NAME;
let RPC_URL;

if(window.location.host == 'bitpow.org'){
    CHAIN_ID = '0x208';
    CHAIN_NAME = 'PoW testnet';
    RPC_URL = 'https://bitfile.org';

    conf = {
        "U": "0x0000000000000000000000000000000000000001"
    };
}else{
    CHAIN_ID = '0x208';
    CHAIN_NAME = 'PoW local';
    RPC_URL = 'http://192.168.1.9:9001';

    conf = {
        "U": "0x0000000000000000000000000000000000000001"
    };
}


window.addEventListener('load', async () => {
    let provider = null;
    let signer = null;
    // const eth_accounts = document.getElementById('eth_accounts');
    const metamask_connect_btn = document.getElementById('metamask_connect');
    const add_contract = document.getElementById('add_contract');
    const get_u = document.getElementById('get_u');

    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();

        // metamask_connect_btn.style.display = 'block';
        metamask_connect_btn.addEventListener('click', async () => {
            // const add_chain = await ethereum.request({ method: 'wallet_addEthereumChain', params: [{
            //         chainId: CHAIN_ID,
            //         chainName: CHAIN_NAME,
            //         nativeCurrency: {
            //         name: TOKEN_NAME,
            //         symbol: TOKEN_SYMBOL, // 2-6 characters long
            //         decimals: 18
            //     },
            //     rpcUrls: [RPC_URL]
            //     //blockExplorerUrls?: string[];
            //     //iconUrls?: string[]; // Currently ignored.
            // }]});

            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: CHAIN_ID }],
            });

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            // const eth_address = accounts[0];
            // add_contract.style.display = 'block';

            // for(let i in accounts) {
            //     console.log(accounts[i]);
            //     let div = document.createElement('div');
            //     div.innerHTML = `${accounts[i]} <input type='button' value='领取测试U' class='add_contract'/>
            //         <input type="button" value="领取测试U" class="get_u"/>`;
            //     div.id = 'eth_'+accounts[i];
            //     div.className = 'eth_account';
            //     eth_accounts.append(div);
            // }

            // window.ethereum.on('accountsChanged', (accounts) => {
            //     while (eth_accounts.firstChild) {
            //         eth_accounts.removeChild(eth_accounts.firstChild);
            //     }
            //     eth_address = accounts[0];
            //     console.log(eth_address);
            //     for(let i in accounts){
            //         console.log(accounts[i]);
            //         const div = document.createElement('div');
            //         div.innerHTML = `${accounts[i]}`;
            //         div.id = `eth_${accounts[i]}`;
            //         div.className = 'eth_account';
            //         eth_accounts.append(div);
            //     }
            // });
        });
    };

    // let provider2;
    // if(window.location.host == 'bitpow.org'){
    //     provider2 = new ethers.providers.WebSocketProvider ('ws://192.168.1.9:8546');
    // }else{
    //     provider2 = new ethers.providers.JsonRpcProvider(RPC_URL);
    // }
    // const wallet = new ethers.Wallet('0xbbfbee4961061d506ffbb11dfea64eba16355cbf1d9c29613126ba7fec0aed5d', provider2);

    const U_abi = [
        'function mint(address,uint256) public',
    ];

    add_contract.addEventListener('click', async (evt) => {
        // const to_address = ethereum.selectedAddress;
        await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: conf['U'], // The address that the token is at.
                    symbol: 'U', // A ticker symbol or shorthand, up to 5 chars.
                    decimals: 0, // The number of decimals in the token
                    image: '', // A string url of the token logo
                },
            },
        });
    });

    get_u.addEventListener('click', async (evt) => {
        const to_address = ethereum.selectedAddress;
        console.log(to_address);
        console.log(signer);
        const U = new ethers.Contract(conf['U'], U_abi, signer);

        const tx = await U['mint(address,uint256)'](to_address, ethers.BigNumber.from(100));
        console.log(tx);
        alert(`U sent to ${to_address}`);
    });

});

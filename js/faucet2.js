import { ethers } from "/dist/ethers-5.6.esm.min.js";

let conf = {
    "U": "0x0000000000000000000000000000000000000003"
};

const TOKEN_NAME = 'PoW';
const TOKEN_SYMBOL = 'POW';

let CHAIN_ID;
let CHAIN_NAME;
let RPC_URL;

if(window.location.host == 'bitpow.org'){
    CHAIN_ID = '0xd08';
    CHAIN_NAME = 'BitPoW testnet2';
    RPC_URL = 'https://testnet2.bitpow.org';
}else{
    CHAIN_ID = '0x208';
    CHAIN_NAME = 'BitPoW local';
    RPC_URL = 'http://192.168.1.9:9001';
}

function help_extension(){
    var s = document.getElementById('help_extension').style;
    s.opacity = 0;
    s.display = "block";
    // s.width = '0%';
    (function fade(){
        console.log(s.opacity);
        if (s.opacity < 1.0){
            s.opacity = parseFloat(s.opacity) + 0.1;
            // s.width = parseInt(s.width.slice(0, -1)) + 10 + '%';
            setTimeout(fade, 40);
        }
    })();
}

window.onload = async () => {
    let provider = null;
    let signer = null;

    const metamask_connect_btn = document.getElementById('metamask_connect');
    const eth_account = document.getElementById('eth_account');
    const add_contract = document.getElementById('add_contract');
    const get_u = document.getElementById('get_u');

    if (typeof window.ethereum === 'undefined') {
        console.log('MetaMask is not installed!');
        return
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    // metamask_connect_btn.style.display = 'block';
    metamask_connect_btn.onclick = async () => {
        if(window.location.host == 'bitpow.org'){
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: CHAIN_ID,
                        chainName: CHAIN_NAME,
                        nativeCurrency: {
                            name: TOKEN_NAME,
                            symbol: TOKEN_SYMBOL, // 2-6 characters long
                            decimals: 18
                        },
                        rpcUrls: [RPC_URL],
                        // blockExplorerUrls: 'https://testnet1.bitpow.org/scan'
                        //iconUrls?: string[]; // Currently ignored.
                    }]
                });
            } catch (error) {
                // you may need to disable other extension before use Metamask
                help_extension();
            }
        }

        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: CHAIN_ID }],
            });
        } catch (error) {
            // you may need to disable other extension before use Metamask
            help_extension();
        }

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts);

        if (ethereum.selectedAddress) {
            eth_account.innerText = ethereum.selectedAddress;
        }
    };

    if (ethereum.selectedAddress) {
        eth_account.innerText = ethereum.selectedAddress;
    }
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

    window.ethereum.on('accountsChanged', (accounts) => {
        // while (eth_accounts.firstChild) {
        //     eth_accounts.removeChild(eth_accounts.firstChild);
        // }
        // eth_address = accounts[0];
        // console.log(eth_address);
        // for(let i in accounts){
        //     console.log(accounts[i]);
        //     const div = document.createElement('div');
        //     div.innerHTML = `${accounts[i]}`;
        //     div.id = `eth_${accounts[i]}`;
        //     div.className = 'eth_account';
        //     eth_accounts.append(div);
        // }
        if (ethereum.selectedAddress) {
            eth_account.innerText = ethereum.selectedAddress;
        }else{
            eth_account.innerText = 'Not connected';
        }
    });

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

    add_contract.onclick = async (evt) => {
        // const to_address = ethereum.selectedAddress;
        await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: conf['U'], // The address that the token is at.
                    symbol: 'U', // A ticker symbol or shorthand, up to 5 chars.
                    decimals: 18, // The number of decimals in the token
                    image: '', // A string url of the token logo
                },
            },
        });
    };

    get_u.onclick = async (evt) => {
        try {
            const to_address = ethereum.selectedAddress;
            console.log(to_address);
            console.log(signer);
            const U = new ethers.Contract(conf['U'], U_abi, signer);

            const tx = await U['mint(address,uint256)'](to_address, ethers.BigNumber.from(10).pow(20));
            console.log(tx);
            alert(`U sent to ${to_address}`);
        } catch (error) {
            // you may need to disable other extension before use Metamask
            // you may need to manually add and switch to network 3335
        }
    };

};

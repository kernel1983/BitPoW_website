
import { ethers } from "/dist/ethers-5.6.esm.min.js";


const CHAIN_ID = '0x208';
const CHAIN_NAME = 'PoW test';
const RPC_URL = 'http://192.168.1.9:9001';

const contract_abi = [
    'function mint(bytes memory handle) public',
];

// const contract_address = "";
// const erc20 = new ethers.Contract(address, abi, provider);

const content = document.getElementById('content');
const content_event_id = document.getElementById('content_event_id');
const content_sig_btn = document.getElementById('content_sig_btn');

window.onload = async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        if(window.ethereum.isConnected()){
        }else{
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        }

        console.log(ethereum.selectedAddress);
        ethereum_address.innerText = ethereum.selectedAddress;

        connect_metamask_btn.onclick = async (evt) => {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            console.log(account);
            ethereum_address.innerText = account;

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
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // const contract = new ethers.Contract(contract_address, contract_abi, signer);

        // handle_mint_btn.onclick = async (evt) => {
        //     const handle = new TextEncoder().encode(handle_mint.value);
        //     await contract.mint(handle);
        //     const rsp = await fetch(`/save_metadata?token=${jwt}&wallet=${ethereum.selectedAddress}`, {method:'POST', body: metadata.value});
        // }

        // Create WebSocket connection.
        const socket = new WebSocket("ws://192.168.1.9:8010/relay");

        // Connection opened
        socket.addEventListener("open", (event) => {
            // socket.send("Hello Server!");
        });

        // Listen for messages
        socket.addEventListener("message", (event) => {
            console.log("Message from server ", event.data);
        });

        var event = {};
        var event_id = '';
        var event_sig = '';
        content.addEventListener('keyup', async (evt) => {
            const timestamp = parseInt(Date.now()/1000);
            const json = JSON.stringify([0, ethereum.selectedAddress, timestamp, 1, [], evt.target.value]);
            // console.log(json);
            event_id = ethers.utils.sha256(new TextEncoder().encode(json));
            content_event_id.innerText = event_id;

            event = {
                "id": event_id,
                "pubkey": ethereum.selectedAddress,
                "created_at": timestamp,
                "kind": 1,
                "tags": [],
                "content": evt.target.value,
            }
        });

        content_sig_btn.onclick = async (evt) => {
            // console.log(ethers.utils.hexlify(new TextEncoder().encode(content.value)));
            const sig = await ethereum.request({
                method: "personal_sign",
                params: [event_id, ethereum.selectedAddress]
            });
            event['sig'] = sig;
            console.log(event);
            socket.send( JSON.stringify(['EVENT', event]) );
        }
    }

    // let provider = null;
    const navbar_burger = document.getElementById('navbar_burger');
    const navbar_menu = document.getElementById('navbar_menu');
    // const metamask_connect_btn = document.getElementsByClassName('metamask_connect');
    // const vault_open = document.getElementById('vault_open');
    // const vaults = document.getElementById('vaults');


    navbar_burger.addEventListener('click', async () => {

        console.log(navbar_menu.style.display);
        if(navbar_menu.style.display == ''){
            navbar_menu.style.display = 'block';
        }else{
            navbar_menu.style.display = '';
        }
    });
}


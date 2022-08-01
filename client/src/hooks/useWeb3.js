import { useEffect, useState, useCallback } from "react";
import Web3 from "web3";

function useWeb3() {

    const [account, setAccount] = useState(null);
    let web3 = null;


    // au chargement du composant il va chercher les infos de metamask
    useEffect(() => {

        const {ethereum, location} = window;

        if (!ethereum) {
            console.warn('Please, install MetaMask.');
            return;
        }

        ethereum.on("chainChanged", () => location.reload());

        ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length > 0) {
                setAccount(accounts[0]);
            } else {
                console.error("No accounts.");
            }
        });

        ethereum.on('connect', (info) => {
            console.log('Connected network.', info)
        })

        ethereum.on('disconnect', (error) => {
            console.log('Disconnected network.', error)
        })

        if( ! account && !! ethereum.selectedAddress ){
            setAccount(ethereum.selectedAddress)
        }

    }, []);

    // fct connect au Metamask
    const connectToMetaMask = useCallback(async () => {
        const {ethereum} = window;

        if (!ethereum) {
            console.warn('Please, install MetaMask.');
            return;
        }  

        try {
            const accounts = await ethereum.request({method: "eth_requestAccounts"})
            
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                console.log(accounts);
            }
        } catch (error) {
            console.error(error.message)
        }
    }, [])



    const {ethereum} = window;
        if (ethereum) {
            web3 = new Web3(window.ethereum);
        } 
        else if (window.web3) {
            // Use Mist/MetaMask's provider.
            web3 = window.web3;
            console.log("Injected web3 detected.");
          }
          // Fallback to localhost; use dev console port by default...
          else {
            const provider = new Web3.providers.HttpProvider(
              "http://127.0.0.1:8545"
            );
            web3 = new Web3(provider);
            console.log("No web3 instance injected, using Local web3.");
          }
        

    return {
        account,
        connectToMetaMask,
        web3
    }
}

export default useWeb3;


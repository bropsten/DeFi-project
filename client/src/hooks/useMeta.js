import { useEffect, useState, useCallback } from "react";
import useWeb3 from "./useWeb3";


function useMeta() {

    const [account, setAccount] = useState(null);
    const { web3 } = useWeb3();



    // au chargement du composant il va chercher les infos de metamask
    useEffect(() => {

        const {ethereum, location} = window;

        if (!ethereum) {
            console.warn('Please, install MetaMask.');
            return;
        }

        ethereum.on("chainChanged", () => location.reload());

        ethereum.on('accountsChanged', (accounts) => {
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

    }, [web3, account]);

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


    return {
        account,
        connectToMetaMask,
        
    }
}

export default useMeta;


import Web3 from "web3";


function useWeb3(){

  let web3 = null;

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

          return{
            web3
          }


}



export default useWeb3;
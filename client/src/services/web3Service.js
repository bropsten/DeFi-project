import getWeb3 from "./getWeb3";
import Staking from "../contracts/Staking.json";

async function getContract(web3) {
    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Staking.networks[networkId];
    const contract = new web3.eth.Contract(
        Staking.abi,
        deployedNetwork && deployedNetwork.address,
    );

    return contract;
}

async function getOwner(web3) {
    const contract = await getContract(web3);
    const owner = await contract.methods.owner().call();

    return owner;
}


async function getAccounts(web3){
    let accounts = [];
    try {
        // Use web3 to get the user's accounts.
        accounts = await web3.eth.getAccounts();
    } catch (error) {
        console.error(error);
    }

    return accounts;
}

export {
    getContract,
    getAccounts,
    getOwner
};


export default async function launchWeb3(){
    try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
    
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Staking.networks[networkId];
        const contract = new web3.eth.Contract(
            Staking.abi,
          deployedNetwork && deployedNetwork.address,
  
        );

        
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }

      
}
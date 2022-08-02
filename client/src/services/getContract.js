import Staking from "../contracts/Staking.json";
import BROToken from "../contracts/BROToken.json";

async function getContract(web3) {
    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Staking.networks[networkId];

    const stakingContract = new web3.eth.Contract(
        Staking.abi,
        deployedNetwork && deployedNetwork.address,
    );

    const BROTokenDeployedNetwork = BROToken.networks[networkId];
    const BROContract = new web3.eth.Contract(
        BROToken.abi,
        BROTokenDeployedNetwork && BROTokenDeployedNetwork.address,
    );

    const contracts = {
        staking: stakingContract,
        BROToken: BROContract
    }

    return contracts;
}

export {
    getContract,
};
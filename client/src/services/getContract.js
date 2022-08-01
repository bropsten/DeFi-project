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

export {
    getContract,

};

import { getContract } from '../services/getContract';
import { useEffect, useState } from "react";
import useWeb3 from './useWeb3'

export default function useContract(){
  const [contract, setContract] = useState(null)
  const { web3 } = useWeb3();

  useEffect(() => {

    if( ! web3 ){
        return;
    }

    async function getContractData(){
        const contractData = await getContract(web3);
        setContract(contractData);
    }
    
    getContractData()
    }, []);

    return {
        contract
    };

}

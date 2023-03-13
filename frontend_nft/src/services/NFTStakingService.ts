import { AbiItem } from 'web3-utils'
import collectionAbi from '../abi/erc721.json'
import factoryAbi from '../abi/factory.json'
import stakeAbi from '../abi/stake.json'
import { clearTransaction, handleTransaction, TransactionType } from '../graphql/variables/TransactionVariable'
import { initializeWeb3 } from './MultiWalletService'
import {collectionAddress, factoryAddress} from '../config'
import { getErc721Metadata } from './UtilService'

export const getNFTIds = async (chainId: number, ownerAddress: string, node: boolean) => {
    const web3 = initializeWeb3(chainId, node)
    const contractMinter = new web3.eth.Contract(collectionAbi as AbiItem[], collectionAddress)    
    try {
        let nftIdArr = await contractMinter.methods.walletOfOwner(ownerAddress).call();

        return nftIdArr;
    } catch (e) {
        console.log(e)
    }
    
    return [];
}

export const getNFTs = async (node: boolean, chainId: number, ownerAddr: string, nftIds: Array<string>, paginationLimit: number, offset: number, filter?: string) => {
    try{
        const web3 = initializeWeb3(chainId, node)

        //---minted nfts---------------------------------------------------------
        const contractMinter = new web3.eth.Contract(collectionAbi as AbiItem[], collectionAddress)    
        const collectionName = await contractMinter.methods.name().call();
        const baseUri = await contractMinter.methods.getBaseURI().call();

        let erc721ItemsMetadata = []

        if(nftIds.length > 0 ) {
            
            for(let i:number = offset; i < offset + paginationLimit; i++) {
                if(i > nftIds.length - 1) break;
                let tokenUri = '';
                tokenUri = baseUri + nftIds[i] + '.json';       
                let metadataObj = await getErc721Metadata(collectionAddress, nftIds[i], web3 );
                metadataObj['tokenId'] = nftIds[i];
                metadataObj['name'] = collectionName;
                metadataObj['isStaking'] = false;
                erc721ItemsMetadata.push(metadataObj)
            }
        }        

        //---staked nfts-------------------------------------------------------------
        const contractFactory = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress);
        let isExistPool = await contractFactory.methods.getTotalStakingContracts().call();
        if(isExistPool === 0) return erc721ItemsMetadata;
        let poolAddr = await contractFactory.methods.getFarmingContract().call();

        const contractStake = new web3.eth.Contract(stakeAbi as AbiItem[], poolAddr);

        let stakedIds = await contractStake.methods.getStakedTokenIds(ownerAddr).call();

        for(let i = offset; i < offset + paginationLimit; i++) {
            if(i > stakedIds.length - 1) break;
            let tokenUri = '';
            tokenUri = baseUri + stakedIds[i] + '.json';        
            let metadataObj = await getErc721Metadata(collectionAddress, nftIds[i], web3);
            metadataObj['name'] = collectionName;
            metadataObj['isStaking'] = true;
            erc721ItemsMetadata.push(metadataObj)
        }

        return erc721ItemsMetadata
    } catch(e) {
        console.log(e)
    }

    return [];
}

export const stakeToken = async (chainId: number, ownerAddress: string, mintedTokeIds: Array<string>, node: boolean) => {    
    const web3 = initializeWeb3(chainId, node);    
    const contractFactory = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress);
    const contractMinter = new web3.eth.Contract(collectionAbi as AbiItem[], collectionAddress);

    try{
        let isExistPool = await contractFactory.methods.getTotalStakingContracts().call();
        if(isExistPool === 0) return -1;

        let poolAddr = await contractFactory.methods.getFarmingContract().call();
        let isApprovedforAll = await contractMinter.methods.isApprovedForAll(ownerAddress, poolAddr).call();
        if(!isApprovedforAll) {
            await contractMinter.methods.setApprovalForAll(poolAddr, true).send({ from: ownerAddress }, (_error: Error, tx: string) => {
                tx ? handleTransaction(tx, TransactionType.mint) : clearTransaction()
            })
        }
        
        const contractStake = new web3.eth.Contract(stakeAbi as AbiItem[], poolAddr);

        await contractStake.methods.stakeTokens(mintedTokeIds).send({ from: ownerAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.mint) : clearTransaction()
        })    
        return 1;
    } catch(e) {
        console.log(e)
    }

    return 0;
}

export const unStakeToken = async (chainId: number, ownerAddress: string, shouldHarvest: boolean, node: boolean) => {    
    const web3 = initializeWeb3(chainId, node);    
    const contractFactory = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress);

    try{
        let isExistPool = await contractFactory.methods.getTotalStakingContracts().call();
        if(isExistPool === 0) return -1;

        let poolAddr = await contractFactory.methods.getFarmingContract().call();

        const contractStake = new web3.eth.Contract(stakeAbi as AbiItem[], poolAddr);

        await contractStake.methods.unstakeTokens(shouldHarvest).send({ from: ownerAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.mint) : clearTransaction()
        })    
        return 1;
    } catch(e) {
        console.log(e)
    }

    return 0;
}
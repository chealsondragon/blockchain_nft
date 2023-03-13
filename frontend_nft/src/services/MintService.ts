import { code } from '../messages'
import { notifyError, notifyWarning, notifySuccess } from './NotificationService'
// import jwt from 'jwt-decode'
// import Cookies from 'universal-cookie';
// import { API } from '../constants/api';
// import axios from 'axios';
import { AbiItem } from 'web3-utils'
import collectionAbi from '../abi/collection.json'
import erc721Abi from '../abi/erc721.json'
import { getChainConfigById } from '../config'
import { clearTransaction, handleTransaction, TransactionType } from '../graphql/variables/TransactionVariable'
import { initializeWeb3 } from './MultiWalletService'

export const mintErc721 = async (collectionAddress: string, ownerAddress: string, cid: string, collection: string, nftType: string, chainId: number) => {
    const web3 = initializeWeb3(chainId)
    const contractMinter = new web3.eth.Contract(collectionAbi as AbiItem[], collectionAddress)
    const contractERC721 = new web3.eth.Contract(erc721Abi as AbiItem[], collectionAddress)

    await contractMinter.methods.mint(cid, ownerAddress).send({ from: ownerAddress }, (_error: Error, tx: string) => {
        tx ? handleTransaction(tx, TransactionType.mint) : clearTransaction()
    })
    // const totalTokens = await contractERC721.methods.balanceOf(ownerAddress).call()
    // const tokenId = await contractERC721.methods.tokenOfOwnerByIndex(ownerAddress, totalTokens - 1).call()
    // const tokenURI = await contractERC721.methods.tokenURI(tokenId).call()

    // const cookies = new Cookies()
    // const headers = {
    //     headers: {
    //         'content-type': 'application/json',
    //         'Authorization': 'Bearer '+ cookies.get('token')
    //     }
    // };

    // let w_data = { cid: cid, collection: collection, category: nftType, chainId: chainId, tokenId: tokenId }
    // let w_return
    // await axios.post(API.server_url + API.item_add, w_data, headers)
    // .then(response => {
    //     if(response.status == 200){
    //         let data:any = response.data;
    //         if(data.status){
    //             w_return = data.result;               
    //         }
    //         notifySuccess(data.message)
    //     }
    // })
    // .catch(error => {
    //     notifyError(code[5011], error)
    // })

    // return w_return;
}

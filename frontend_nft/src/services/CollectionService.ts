import { AbiItem } from 'web3-utils'
import erc3525MintAbi from '../abi/erc721Mint.json'
import { clearTransaction, handleTransaction, TransactionType } from '../graphql/variables/TransactionVariable'
import { initializeWeb3 } from './MultiWalletService'
import { code } from '../messages'
import { notifyError, notifySuccess } from './NotificationService'
import { API } from '../constants/api';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Erc3525Collection } from '../types/nftType';

interface CollectionService {
    getCollectionItems(
        paginationLimit: number,
        searchName?: string,
        offset?: number
    ): Promise<Erc3525Collection[]>
}

/*******************************************************************
* this function is to request to server for getting collection info
*******************************************************************/
export const getCollectionInfo = async (data: any, chainId: number) => {
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    let w_return: Erc3525Collection = {_id:'', name: '', symbol: '', description: '', decimals: 18, item_count: 0, image: '', contract_address: '', category: 1, slottype: []};
    try {
        let w_result = await axios.post(API.server_url + API.collection_detail, data, headers)
        if(w_result.status === 200){
            let data:any = w_result.data;
            
            if(data.status){
                w_return['_id'] = data.result['_id'];
                w_return['name'] = data.result['name'];
                w_return['symbol'] = data.result['symbol'];
                w_return['description'] = data.result['description'];
                w_return['item_count'] = data.result['item_count'];
                w_return['image'] = data.result['image'];
                w_return['contract_address'] = data.result['contract_address'];
                w_return['category'] = data.result['category'];
                w_return['slottype'] = JSON.parse(data.result['slottype']);
                notifySuccess(data.message)
                return w_return;
            }
        }
        return w_return;
    } catch(error) {
        notifyError(code[5011])
        return w_return;
    }
}

/*******************************************************************
* this function is to request to server for updating collection info
*******************************************************************/
export const UpdateCollection = async (data: any) => {
    let w_return = false;
    const cookies = new Cookies();
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };

    await axios.post(API.server_url + API.collection_update, data, headers)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                notifySuccess('successfully updated')
                w_return = true;
            } else {
                notifyError('name is duplicated')
            }      
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })
    return w_return;
}

/*******************************************************************
* this function is to request to server for deleting a collection
*******************************************************************/
export const deleteCollection = async (data: any) => {
    return false;    
}

/*******************************************************************
* this function is to request to server for adding collection info
*******************************************************************/
export const AddCollection = async (minterAddress: string, data: Erc3525Collection, ownerAddress: string, chainId: number) => {
    let w_return = false;
    const cookies = new Cookies();
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };

    await axios.post(API.server_url + API.collection_add, data, headers)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                notifySuccess('successfully created')
                w_return = true;
            } else {
                notifyError('name is duplicated')
            }      
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })
    return w_return;
}

/*******************************************************************
* this function is to request to server for uploading logo and banner
*******************************************************************/
export const imageUpload = async (data: any) => {
    let w_return = false;
    let url = '';

    url = API.server_url + API.collection_image_upload;
    
    await axios.post(url, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            w_return = data.status;
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

/*******************************************************************
* this function is to request to server for getting collection list
*******************************************************************/
export const collectionService = () : CollectionService => {
    return {
        async getCollectionItems(
            paginationLimit,
            searchName: string,
            offset = 0
        ) {
            const cookies = new Cookies()
            const headers = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer '+ cookies.get('token')
                }
            };
            const result_data: Erc3525Collection[] = [];
            let cond_data: any = {};
            cond_data['paginationLimit'] = paginationLimit;
            cond_data['offset'] = offset;
            cond_data['searchName'] = searchName;
            cond_data['type'] = 'my';

            try {
                let w_result = await axios.post(API.server_url + API.collection_list, cond_data, headers)
                if(w_result.status === 200){
                    let data:any = w_result.data;               
                    if(data.status){
                        let w_cnt = 0;
                        let w_items: any = data.data;

                        w_items.find((item:any) => {
                            let w_objTemp: Erc3525Collection = {
                                _id: '',
                                name: '',
                                symbol: '',
                                item_count: 0,
                                image: '',
                                category: 1
                            };

                            w_objTemp['_id'] = item._id;
                            w_objTemp['name'] = item.name;
                            w_objTemp['symbol'] = item.symbol;
                            w_objTemp['item_count'] = item.item_count;
                            w_objTemp['image'] = item.image;
                            w_objTemp['category'] = item.category;
                            result_data[w_cnt] = w_objTemp;
                            w_cnt++;
                        })
                        notifySuccess(data.message)
                        return result_data;
                    }
                }
                return []
            } catch(error) {
                notifyError(code[5011])
                return []
            }
        }
    }
} 

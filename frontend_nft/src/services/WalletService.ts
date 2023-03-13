// import axios from 'axios'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import erc721Abi from '../abi/erc721.json'
import { getChainConfigById } from '../config'
import { code } from '../messages'
import { MarketplaceERC20Item } from '../types/MarketplaceTypes'
import { WalletErc721Item } from '../types/WalletTypes'
import { initializeWeb3 } from './MultiWalletService'
import { getErc721Metadata, scale } from './UtilService'
import { notifyError } from './NotificationService'
import { nftGraphQlClient } from '../graphql/nft/ClientNftGraphql'
import { NftByWalletData, NftByWalletVar, NFTS_BY_WALLET_QUERY } from '../graphql/nft/wallet/nftsByWallet'
import { NFT_BY_ADDRESS_QUERY, NftByAddressData, NftByAddressVar } from '../graphql/nft/nftByAddress'
// import Cookies from 'universal-cookie';
// import { API } from '../constants/api';

interface WalletService {
  get721Items(account: string, chainId: number, offset: number, limit: number): Promise<WalletErc721Item[]>
  get721Item(address: string, tokenId: string, chainId: number): Promise<WalletErc721Item | null>
}

export const walletService = (): WalletService => {
    return apiProvider()
}

const apiProvider = (): WalletService => {
  return {
    get721Items: async (account, chainId, offset, limit) => {
      const web3 = initializeWeb3(chainId)
      try {
        let erc721Items: WalletErc721Item[] = []
        const nftsByWallet = await nftGraphQlClient(chainId).query<NftByWalletData, NftByWalletVar>({
          query: NFTS_BY_WALLET_QUERY,
          variables: {
            owner: account
          }
        })
        console.log(nftsByWallet)
        if(typeof nftsByWallet!== "undefined") {
          if(typeof nftsByWallet.data !== "undefined") {
            nftsByWallet.data.nfts.forEach(nft => {
              erc721Items.push({
                id: nft.id,
                address: nft.collection.id,
                tokenId: nft.tokenId,
                name: nft.collection.name,
                symbol: nft.collection.symbol
              })
            })
          }
        }  

        const erc721ItemsMetadataPromises: Promise<{
          name: string
          address: string
          tokenId: string
          description: string
          image_url: string
          animation_url: string | undefined
          social_media?: string
          animationType: string | undefined
        }>[] = []

        erc721Items.forEach(erc721Item => erc721ItemsMetadataPromises.push(getErc721Metadata(erc721Item.address, erc721Item.tokenId, web3)))
        const erc721ItemsMetadata = await Promise.all(erc721ItemsMetadataPromises)
          
        erc721Items = erc721Items.map(erc721Item => {
          const metadata = erc721ItemsMetadata.find(
            erc721ItemMetadata => erc721Item.address === erc721ItemMetadata.address && erc721Item.tokenId === erc721ItemMetadata.tokenId
          )

          if (metadata) {
            const erc721ItemClone = { ...erc721Item }

            erc721ItemClone.metadata = {
              name: metadata.name,
              image: metadata.image_url,
              imageFull: metadata.image_url,
              social_media: metadata.social_media,
              description: metadata.description,
              animation_url: String(metadata.animation_url),
              animationType: metadata.animationType
            }
            return erc721ItemClone
          }

          return erc721Item
        })
  
        return erc721Items      
      } catch(e) {
        return []
      }
    },
    get721Item: async (address, tokenId, chainId): Promise<WalletErc721Item | null> => {
      const web3 = initializeWeb3(chainId)
      try {
        const nftByAddress = await nftGraphQlClient(chainId).query<NftByAddressData, NftByAddressVar>({
          query: NFT_BY_ADDRESS_QUERY,
          variables: {
            id: `${address.toLowerCase()}#${tokenId}`
          }
        })
    
        const {
          description,
          image_url,
          name,
          social_media,
          animation_url,
          author,
          attributes,
          animationType
        } = await getErc721Metadata(address, tokenId, web3)
        return {
          name: nftByAddress.data.nft.collection.name,
          ownerAddress: nftByAddress.data.nft.owner,
          address,
          tokenId,
          symbol: nftByAddress.data.nft.collection.symbol,
          metadata: {
            image: image_url,
            imageFull: image_url,
            social_media,
            name,
            author,
            attributes,
            animationType,
            description,
            animation_url: String(animation_url)
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Could not find metadata`)
        return null
      }
    }
  }
}
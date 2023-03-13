import { getChainConfigById } from '../config'
import { code } from '../messages'
import { ERC20Asset, MarketplaceERC20Item, MarketplaceERC20ItemTypeEnum } from '../types/MarketplaceTypes'
import { notifyError } from './NotificationService'
import { units } from './UtilService'
import { walletService } from './WalletService'
import { initializeWeb3 } from './MultiWalletService'
import BigNumber from 'bignumber.js'
import { AbiItem } from 'web3-utils'
import { scale } from '../services/UtilService'
import { nftGraphQlClient } from '../graphql/nft/ClientNftGraphql'
import { NftByWalletData, NftByWalletVar, NFTS_BY_WALLET_QUERY } from '../graphql/nft/wallet/nftsByWallet'
import { NFT_BY_ADDRESS_QUERY, NftByAddressData, NftByAddressVar } from '../graphql/nft/nftByAddress'

interface MarketplaceService {
  getMarketplaceItems(
    orderDirection: 'asc' | 'desc',
    orderField: 'timestamp' | 'liquidity' | 'name',
    paginationLimit: number,
    filterCurrent: string,
    offset?: number,
    searchName?: string,
    released?: boolean
  ): Promise<MarketplaceERC20Item[]>
}

export const marketplaceService = (chainId: number, version: 1 | 2): MarketplaceService => {
  return {
    async getMarketplaceItems(
      orderDirection: 'asc' | 'desc',
      orderField: 'timestamp' | 'liquidity' | 'name',
      paginationLimit,
      activeFilters,
      offset = 0,
      searchName: string,
      released = false
    ) {
      return [{
        id: "1",
        name: "Post Covid Retro Futurism",
        target: {
          id: "1",
          tokenId: "1",
          tokenURI: "ipfs/aaa",
          collection: {
            id: "1",
            name: "COVID"
          }
        },
        decimals: 10000,
        exitPrice: "100",
        released: false,
        paymentToken: {
          id: "1",
          name: "eth",
          symbol: "eth",
          decimals: 1000000
        },
        timestamp: 10000232,
        totalSupply: "100",
        holdersCount: 3,
        type: 'SET_PRICE',
        status: 'AUCTION',
        metadata: {image: 'assets/gallery/1.jpg', name: 'Post Covid Retro Futurism', animation_url: ''},
        cutoff: 10,
        minimumDuration: 30
      },
      {
        id: "2",
        name: "Thud",
        target: {
          id: "2",
          tokenId: "2",
          tokenURI: "ipfs/aaa",
          collection: {
            id: "2",
            name: "thud"
          }
        },
        decimals: 10000,
        exitPrice: "100",
        released: false,
        paymentToken: {
          id: "1",
          name: "eth",
          symbol: "eth",
          decimals: 1000000
        },
        timestamp: 10000232,
        totalSupply: "100",
        holdersCount: 3,
        type: 'SET_PRICE',
        status: 'AUCTION',
        metadata: {image: 'assets/gallery/2.jpg', name: 'Thud', animation_url: ''},
        cutoff: 10,
        minimumDuration: 30
      },
      {
        id: "3",
        name: "They",
        target: {
          id: "3",
          tokenId: "3",
          tokenURI: "ipfs/aaa",
          collection: {
            id: "2",
            name: "they"
          }
        },
        decimals: 10000,
        exitPrice: "100",
        released: false,
        paymentToken: {
          id: "1",
          name: "eth",
          symbol: "eth",
          decimals: 1000000
        },
        timestamp: 10000232,
        totalSupply: "100",
        holdersCount: 3,
        type: 'SET_PRICE',
        status: 'AUCTION',
        metadata: {image: 'assets/gallery/3.jpg', name: 'Thud', animation_url: ''},
        cutoff: 10,
        minimumDuration: 30
      },
      {
        id: "4",
        name: "Baby, Baby, Can I Invade Your Country",
        target: {
          id: "4",
          tokenId: "4",
          tokenURI: "ipfs/aaa",
          collection: {
            id: "4",
            name: "baby"
          }
        },
        decimals: 10000,
        exitPrice: "100",
        released: false,
        paymentToken: {
          id: "1",
          name: "eth",
          symbol: "eth",
          decimals: 1000000
        },
        timestamp: 10000232,
        totalSupply: "100",
        holdersCount: 3,
        type: 'SET_PRICE',
        status: 'AUCTION',
        metadata: {image: 'assets/gallery/4.jpg', name: 'Thud', animation_url: ''},
        cutoff: 10,
        minimumDuration: 30
      }
    ];
      const nftsByWallet = await nftGraphQlClient(chainId).query<NftByWalletData, NftByWalletVar>({
        query: NFTS_BY_WALLET_QUERY,
        variables: {
          owner: 'account'
        }
      })
      let cond_data:any = {};
      cond_data['chainId'] = chainId;
      cond_data['paginationLimit'] = paginationLimit;
      cond_data['offset'] = offset;
      cond_data['searchName'] = searchName;
      cond_data['orderField'] = orderField;
      cond_data['orderDirection'] = orderDirection;      
      
    }
  }
}

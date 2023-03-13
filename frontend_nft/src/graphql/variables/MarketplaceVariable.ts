import { makeVar } from '@apollo/client'
import { MarketplaceERC20Item } from '../../types/MarketplaceTypes'

export const buyModalVar = makeVar<
  | {
      type: 'nft' | 'shares'
      item: MarketplaceERC20Item
    }
  | undefined
>(undefined)

export const buyModalLiquidityVar = makeVar<boolean>(false)

export const poolsRefreshingVar = makeVar<number | undefined>(undefined)

export const assetsModalMarketplaceVar = makeVar(false)

export const sortingFieldMarketplaceItemsVar = makeVar<'timestamp' | 'liquidity' | 'name'>('timestamp')
export const sortingDirectionMarketplaceItemsVar = makeVar<'asc' | 'desc'>('desc')
export const searchMarketPlaceVar = makeVar<string>('')
export const offsetMarketplaceVar = makeVar<number>(0)

// eslint-disable-next-line no-shadow
export enum MarketplaceFilter {
  all = 'all',
  startAuction = 'startAunction',
  liveAuction = 'liveAuction',
  buyNow = 'buyNow',
  recentSold = 'recentSold',
  sold = 'sold'
}

export const marketplaceFiltersVar = makeVar<MarketplaceFilter>(MarketplaceFilter.all)

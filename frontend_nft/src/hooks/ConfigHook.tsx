import { useReactiveVar } from '@apollo/client'
import { chainConfig, globalConfig, GlobalConfigV2 } from '../config'
import { chainIdVar } from '../graphql/variables/WalletVariable'

interface ChainConfigV2Migration {
  chainId: number | undefined
  marketplaceBlacklist: string[]
}

export function useGlobalConfig(): GlobalConfigV2 {
  return globalConfig
}

export function useChainConfig(): ChainConfigV2Migration {
  const chainId = useReactiveVar(chainIdVar)
  const config = chainConfig(chainId)
  return { chainId: typeof config !== "undefined"?config.id:0, marketplaceBlacklist: typeof config !== "undefined"?config.marketplaceBlacklist:[] }
}

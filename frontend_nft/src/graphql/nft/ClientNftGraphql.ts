import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ChainConfig, getChainConfigById } from '../../config'

export const nftGraphQlClient = (chainId: number) => {
  const chain: ChainConfig = getChainConfigById(chainId)

  return new ApolloClient({
    uri: chain.nftBaseUrl,
    typeDefs: undefined,
    resolvers: undefined,
    cache: new InMemoryCache({})
  })
}

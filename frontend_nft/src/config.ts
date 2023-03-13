export interface ChainConfig {
  id: number
  name: string
  networkTokenSymbol: string
  pinataBaseUrl: string
  nftBaseUrl: string
  etherscanAddress: string
  bscScanAddress: string
  infuraAddress: string
  bscNodeAddress: string
  ethAddress: string
  mint: {
    minterAddress: string
    defaultCollectionAddress: string
  }
  marketplaceBlacklist: string[]
}

export interface GlobalConfigV2 {
  paginationLimit: number
}

export const globalConfig: GlobalConfigV2 = {
  paginationLimit: 8
}
export const infuraKey = process.env.REACT_APP_INFURA_KEY
export const infuraAddress = `https://mainnet.infura.io/v3/${infuraKey}`
export const bscNodeAddress = `https://bsc-dataseed.binance.org/`
export const allowedChains: Array<number> = [1, 5, 56];
export const pagenationLimit = 8;

export const chainsConfig: ChainConfig[] = [
  {
    id: 1,
    pinataBaseUrl: 'https://nftfypinningservice.azurewebsites.net/api/uploadMedia',
    nftBaseUrl: 'https://api.thegraph.com/subgraphs/id/QmTb4nBjfoUnGZNatsFQK5m2xwnW11qQ9ojyx2QfWNsoDV',
    etherscanAddress: 'https://etherscan.com/',
    bscScanAddress: 'https://bscscan.com/',
    name: 'Eth mainnet',
    infuraAddress: `https://mainnet.infura.io/v3/${infuraKey}`,
    networkTokenSymbol: 'Eth',
    bscNodeAddress: `https://bsc-dataseed.binance.org/`,
    ethAddress: '0x0000000000000000000000000000000000000000',
    mint: {
      minterAddress: '0x89bfCA2Be750724d27e5246BBb5684ec6C135100',
      defaultCollectionAddress: '0x9c8a2b35B268bf2AA69f5fc105514e34daF3cEBb'
    },
    marketplaceBlacklist: [
      '0xe0d522a32eb8f8b73702039c9e5a1285e3862b28',
      '0x38d78c1b49ab10ba162990eedb72824bb8163b86',
      '0x0622c046f185bdaec9d615fe458526423c1712fc'
    ]
  },
  {
    id: 5,
    pinataBaseUrl: 'https://nftfypinningservice.azurewebsites.net/api/uploadMedia',
    nftBaseUrl: 'https://api.thegraph.com/subgraphs/id/QmTb4nBjfoUnGZNatsFQK5m2xwnW11qQ9ojyx2QfWNsoDV',
    etherscanAddress: 'https://testnet.goerliscan.com/',
    bscScanAddress: 'https://bscscan.com/',
    name: 'Georli testnet',
    networkTokenSymbol: 'Eth',
    bscNodeAddress: `https://bsc-dataseed.binance.org/`,
    ethAddress: '0x0000000000000000000000000000000000000000',
    infuraAddress: `https://mainnet.infura.io/v3/${infuraKey}`,
    mint: {
      minterAddress: '0x89bfCA2Be750724d27e5246BBb5684ec6C135100',
      defaultCollectionAddress: '0x9c8a2b35B268bf2AA69f5fc105514e34daF3cEBb'
    },
    marketplaceBlacklist: [
      '0xe0d522a32eb8f8b73702039c9e5a1285e3862b28',
      '0x38d78c1b49ab10ba162990eedb72824bb8163b86',
      '0x0622c046f185bdaec9d615fe458526423c1712fc'
    ]
  },
  {
    id: 56,
    networkTokenSymbol: 'BNB',
    pinataBaseUrl: 'https://nftfypinningservice.azurewebsites.net/api/uploadMedia',
    nftBaseUrl: 'https://api.thegraph.com/subgraphs/id/QmTb4nBjfoUnGZNatsFQK5m2xwnW11qQ9ojyx2QfWNsoDV',
    etherscanAddress: 'https://etherscan.io/',
    bscScanAddress: 'https://bscscan.com/',
    name: 'Binance Smart Chain',
    infuraAddress: `https://mainnet.infura.io/v3/${infuraKey}`,
    bscNodeAddress: `https://bsc-dataseed.binance.org/`,
    ethAddress: '0x0000000000000000000000000000000000000000',
    mint: {
      minterAddress: '0x62cF87B0E441e6E3A1634304AbA6332F3Fd6464F',
      defaultCollectionAddress: '0x9c8a2b35B268bf2AA69f5fc105514e34daF3cEBb'
    },
    marketplaceBlacklist: [
      '0xe0d522a32eb8f8b73702039c9e5a1285e3862b28',
      '0x38d78c1b49ab10ba162990eedb72824bb8163b86',
      '0x0622c046f185bdaec9d615fe458526423c1712fc'
    ]
  }
]

export const collectionAddress = '0x8dDAb74D02ba4f1DE1Ed917e871D661e72a093dD'; // Collection of NFTS
export const factoryAddress = '0x5ce71939aE359f684b024f19558Ae3881287EAc9';//'0x056733a157093e9fd3237522c0ff23fddf402007';

export const getChainConfigById = (id: number): ChainConfig => chainsConfig.find(chain => chain.id === id) || chainsConfig[0]
export const chainConfig = (id: number): ChainConfig | undefined => chainsConfig.find(chain => chain.id === id)
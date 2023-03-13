
interface Itype {
  name: string
}

interface metadata {
  author?: string
  description?: string
  image:string
  imageFull?:string
  name?:string
  animation_url?: string
  asset_contract?: Itype
  social_media?:string
  web_site_url?:string
  twitter?: string
  telegram?:string
  discord?: string
  instagram?: string
  animationType?: string
  attributes?: []
}

 
export interface WalletErc721Item {
  tokenId: string
  cid?: string
  metadata?:metadata
  ownerAddress?:string
  extension?: string
  address: string
  fee?: string
  fractionsCount?: string
  id?: string
  limitPrice?: string
  reservePrice?: string
  seller?: string
  cutoff?: number | null
  status?: 'CREATED' | 'FUNDED' | 'STARTED_OR_ENDING' | 'ENDING' | 'ENDED'
  timestamp?: string
  name?: string
  symbol?: string
  animationType?: string
  isStaking?: string
}

// eslint-disable-next-line no-shadow
export enum CollectiveBuyStatus {
  CREATED = 'CREATED',
  FUNDED = 'FUNDED',
  STARTING_OR_ENDING = 'STARTED_OR_ENDING',
  ENDING = 'ENDING',
  ENDED = 'ENDED'
}

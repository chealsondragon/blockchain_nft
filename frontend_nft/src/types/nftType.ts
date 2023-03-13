export interface Erc3525Attribute {
  trait_type: string
  value: string
}

export interface Erc3525Metadata {
  title: string
  author: string
  image: string
  alt?: string
  description?: string
  social_media?: string
  created_at: string
  attributes?: Erc3525Attribute[]
}

export interface Erc3525SlotType {
  property: string
  values: string[]
}

export interface Erc3525Collection {
  _id: string
  name: string
  symbol?: string
  decimals?: number
  description?: string
  image: string
  slottype?: Erc3525SlotType[]
  category: number
  contract_address?: string
  item_count?: number
}
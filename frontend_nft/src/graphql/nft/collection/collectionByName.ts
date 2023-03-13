import { gql } from '@apollo/client'

export interface CollectionByNameVar {
  name: string
}

export interface CollectionByNameData {
  id: string
}

export const COLLECTION_BY_NAME_QUERY = gql`
    query CollectionByName($name: String = ""){
        collections(
            where: {
                name: $name
            }
        ) {
            id
        }
    }
`

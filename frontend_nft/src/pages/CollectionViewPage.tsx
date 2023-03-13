import { useReactiveVar } from '@apollo/client'
import { Button, Input } from 'antd'
import { colors, colorsV2, fonts, viewportMargin, viewportV2 } from '../styles/variables'
import React, { useState, useEffect } from 'react'
import {useSearchParams} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component'
import styled, { css } from 'styled-components'
import { FooterCardMarketplace } from '../components/marketplace/FooterCardMarketplace'
import { FooterCardMarketplaceLoading } from '../components/marketplace/FooterCardMarketplaceLoading'
import EmptyState from '../components/shared/EmptyState'
import { CardTemplate } from '../components/shared/CardTemplate'
import {
  marketplaceFiltersVar,
  sortingDirectionMarketplaceItemsVar,
  sortingFieldMarketplaceItemsVar
} from '../graphql/variables/MarketplaceVariable'
// import { useChainConfig, useGlobalConfig } from '../hooks/ConfigHook'
import { useMarketplaceNfts } from '../hooks/MarketplaceHooks'
import CollectionMain from '../components/collection/CollectionMain';
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { getCollectionInfo } from '../services/CollectionService'
import { NftCard } from '../components/cards/NftCard'
import { WalletErc721Item } from '../types/WalletTypes'
import { pagenationLimit } from '../config'
import { accountVar, chainIdVar } from '../graphql/variables/WalletVariable'
import { walletService } from '../services/WalletService'
import { Erc3525Collection } from '../types/nftType';


export default function CollectionViewPage() {
  const [searchParams] = useSearchParams();
  const collectionId:any  = searchParams.get('collectionId');
  const [collection, setCollection] = useState<Erc3525Collection>({_id: '', name:'', image: '', symbol: '', item_count:0, category: 1});

  const account = useReactiveVar(accountVar)
  const chainId = useReactiveVar(chainIdVar)
  const [loading, setLoading] = useState(true)
  const [nfts, setNfts] = useState<WalletErc721Item[]>([])

  const [offset, setOffset] = useState(pagenationLimit)
  const [hasMore, setHasMore] = useState(true)

  const loadingCards = (
    <S.CardsContainer>
      {[...Array(pagenationLimit)].map(() => (
        <NftCard key={`loading-${Math.random()}`} loading fractionalize size='small' />
      ))}
    </S.CardsContainer>
  )

  useEffect(()=>{
    getCollection();
  }, [collectionId])

  const getCollection = async () => {
    let data = {_id: collectionId};
    let collectionData: Erc3525Collection = await getCollectionInfo(data, chainId);
    setCollection(collectionData);
  }

  useEffect(() => {
    const getInitialNfts = async () => {
      if (account && chainId) {
        try {
          const nftItems = await walletService().get721Items(
            account,
            chainId,
            0,
            pagenationLimit
          )

          setNfts(nftItems)
          setHasMore(false)
        } catch (error) {
          console.log(error)
        }
      }
      setLoading(false)
    }
    getInitialNfts()
  }, [account, chainId, pagenationLimit])

  const getNextNfts = async () => {
    if (account && chainId) {
      try {
        const nftItems = await walletService().get721Items(
          account,
          chainId,
          offset,
          pagenationLimit
        )

        setNfts([...nfts, ...nftItems])
        setOffset(offset + pagenationLimit)

        if (nftItems.length < pagenationLimit) {
          setHasMore(false)
        }
      } catch (error) {
        console.log(true)
      }
    }
  }
  return (
    <>
      <Header />
      <S.Main>
        <CollectionMain name={collection['name']} banner={collection['image']} item_count={collection['item_count']?collection['item_count']:0} collection_id={ collectionId } collection_address={collection['contract_address']} category={collection['category']}/>
      </S.Main>   
      <S.Contents>
        {loading && loadingCards}
        {!loading && nfts.length && (
          <InfiniteScroll dataLength={nfts.length} next={getNextNfts} hasMore={hasMore} loader={loadingCards}>
            <S.CardsContainer>
              {nfts.map(nftItem => (
                <NftCard
                  key={`${nftItem.id}`}
                  name={typeof nftItem.metadata !== "undefined"? nftItem.metadata.name:`${nftItem.name} #${nftItem.tokenId}`}
                  typeName={nftItem.name}
                  image={typeof nftItem.metadata !== "undefined"? nftItem.metadata.image: ''}
                  metadata={nftItem.metadata}
                  address={nftItem.address}
                  url={`/items/${nftItem.address}/${nftItem.tokenId}`}
                  fractionalize
                  size='small'
                />
              ))}
            </S.CardsContainer>
          </InfiniteScroll>
        )}
      </S.Contents>
      <Footer />
    </>
  )
}

export const S = {
  Button: styled(Button)`
  margin-right: 20px !important;
  background-color: ${colors.red1};
  color: ${colors.white};
  border-radius: 5px !important;
  padding: 3px 15px 5px 15px !important;
  cursor: pointer !important;
  float: left;

  &:hover,
  &:active,
  &:focus {
    background-color: ${colors.red2};
    opacity: 0.8;
  }
  margin-top: 10px;
  margin-bottom: -10px;
  @media (min-width: ${props => props.theme.viewport.tablet}) {
    margin-top: 0px;
    margin-right: 0px !important;
    margin-left: 20px !important;
    float: right;
  }
  `,
  Input: styled(Input)`
    padding: 0.375rem 0.75rem;
    fontSize: 0.875rem;
    lineHeight: 1.5;
    color: ${(props)=>props.theme.gray['4']};
    background: ${(props)=>props.theme.gray['0']};
    backgroundClip: padding-box;
    border: 1px solid ${(props)=>props.theme.gray['2']};
    borderRadius: 0.25rem;
    marginBottom: 10px;
    width: 100%;
    display: inline-block;

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      width: calc(100% - 230px);
    }
  `,
  Main: styled.div `
    width: 100%;
    background: #F6F6F6;
    margin-top: 96px;
  `,
  Contents: styled.div `
    padding: 3px 24px; 
    background: ${props => props.theme.white};
    display: block;
    align-items: center;

    @media (min-width: ${props => props.theme.viewport.mobile}) {
      min-height: 31.1vh;
    }
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      min-height: 39.3vh;
    }
    @media (min-width: ${props => props.theme.viewport.desktop}) {
      min-height: 54.2vh;
    }
    @media (min-width: ${props => props.theme.viewport.desktopl}) {
      min-height: 33.3vh;
      padding: 3px 124px;
    }
    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      min-height: 33.3vh;
      padding: 3px 250px;
    }
  `,
  CardsContainer: styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2vw;
    justify-content: flex-start;
    align-items: flex-start;

    > div:last-of-type {
      margin-bottom: 4vw;
    }

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      grid-template-columns: repeat(3, 1fr);

      > div:last-of-type {
        margin-bottom: 4vw;
      }
    }

    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      grid-template-columns: repeat(4, 1fr);
      gap: 2vw;

      > div:last-of-type {
        margin-bottom: 2vw;
      }
    }
  `
}

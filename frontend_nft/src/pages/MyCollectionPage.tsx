import { Button, Input } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import { FooterCardMarketplaceLoading } from '../components/marketplace/FooterCardMarketplaceLoading'
import { PaginationButton } from '../components/shared/PaginationButton'
import EmptyState from '../components/shared/EmptyState'
import { CollectionCardTemplate } from '../components/shared/CollectionCardTemplate'
import { pagenationLimit } from '../config'
import { useMyCollections } from '../hooks/MyCollectionHooks'
import { colors, colorsV2, fonts, viewportMargin, viewportV2 } from '../styles/variables'
import { DefaultPageTemplate } from './template/DefaultPageTemplate'
import * as IoIcons from 'react-icons/io';
import { API } from '../constants/api';

export default function MyCollectionPage() {
  const navigate = useNavigate()
  const [searchKey, setSearchKey] = useState('');
  const [searchName, setSearchName] = useState('');

  const { loading, hasMore, loadMore, collections } = useMyCollections(pagenationLimit, searchName)
  const loader = (
    <S.CardsContainer>
      {[...Array(pagenationLimit)].map(() => (
        <CollectionCardTemplate key={`loading-${Math.random()}`} loading >
          <FooterCardMarketplaceLoading loading />
        </CollectionCardTemplate>
      ))}
    </S.CardsContainer>
  )
  
  const searchHandler = (e: any) => {
    e.preventDefault();
    setSearchKey(e.target.value);
  }
  
  const changeSearchName = (e: any, val:string) => {
    e.preventDefault();
    setSearchName(val);
    setSearchKey(val)
  }

  const submitCreate = async() => {
    navigate({
      pathname: "/collection/operation",
      search: `?mode=create`
    });
  }
  return (
    <>    
    <DefaultPageTemplate bgGray> 
      <div style={{margin: '10px 0 10px 0'}}>
        <S.Title>My collection</S.Title>
        <div>
          <S.Label>Manage collections of unique NFTs to share and sell.</S.Label>
          <S.Button id='create' onClick={submitCreate}>
            Create Collection
          </S.Button>
        </div>        
        <S.Input onChange = {(e) => searchHandler(e)} value={searchKey} type='text' placeholder='Search'></S.Input>
        <div style={{display: 'inline-block', width: '230px'}}>          
          <S.Button onClick={(e:any)=>changeSearchName(e, '')}>
            <IoIcons.IoMdSync style={{width: '20px', height: '20px', marginBottom: '-5px'}} />
            Reset
          </S.Button>
          <S.Button onClick={(e:any)=>changeSearchName(e, searchKey)}>
            <IoIcons.IoMdSearch style={{width: '20px', height: '20px', marginBottom: '-7px'}} />
            Search
          </S.Button>
        </div>
      </div>
      {!loading && !collections.length && <EmptyState />}
      <InfiniteScroll next={loadMore} hasMore={hasMore} loader={loader} dataLength={collections.length}>
        <S.CardsContainer>
          {collections.map(collection => {
            let collectionName: string = '';
            let itemCount: number = 0;
            if(collection) {
              collectionName = collection.name;
              itemCount = collection.item_count?collection.item_count:0;
            }

            return (
              <CollectionCardTemplate
                key={`${collection._id}`}
                banner={API.server_url + API.collection_image + collection.image}
                name={collectionName}
                itemCount={itemCount}
                id = {`${collection._id}`}
                url={`/collection/view/`}>
              </CollectionCardTemplate>
            )
          })}
        </S.CardsContainer>
      </InfiniteScroll>
    </DefaultPageTemplate>
    </>
  )
}

export const S = {
  Title: styled.div `
    font-size: 32px;
    font-weight: bold;
    margin: 20px 0px 10px;
    color: ${(props:any)=>props.theme.black}
  `,
  Label: styled.div `
    font-size: 14px;
    margin-bottom: 20px;
    display: inline-block;
    color: ${(props:any)=>props.theme.black}
  `,
  Button: styled(Button)`
    margin-right: 20px !important;
    background-color: rgb(34, 106, 237);
    border: none;
    color: ${colors.white};
    border-radius: 5px !important;
    padding: 3px 15px 5px 15px !important;
    cursor: pointer !important;
    float: left;

    &:hover,
    &:active,
    &:focus {
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
    margin-top: 20px;

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      width: calc(100% - 230px);
    }
  `,
  CardsContainer: styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 4vw;
    justify-content: flex-start;
    align-items: flex-start;

    > div:last-of-type {
      margin-bottom: 4vw;
    }
    @media (min-width: ${props => props.theme.viewport.mobile}) {
      min-height: 29.7vh;
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
      min-height: 49vh;
      grid-template-columns: repeat(4, 1fr);
      gap: 2vw;

      > div:last-of-type {
        margin-bottom: 2vw;
      }
    }
  `,
  Filter: styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    box-shadow: none;
    margin-bottom: ${viewportMargin.base};

    .ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused {
      border: none;
      box-shadow: none;
    }

    > div {
      display: flex;
      align-items: center;

      &.without-filter {
        width: 100%;
        > button {
          margin-left: auto;
        }
      }

      > div:nth-child(1) {
        display: flex;
        align-items: center;

        span {
          font-family: ${fonts.nunito};
          font-style: normal;
          font-weight: 600;
          font-size: 1.4rem;
          line-height: 1.6rem;
          color: ${colorsV2.gray[3]};
          margin-right: 8px;
        }
      }
    }

    @media (min-width: ${viewportV2.tablet}) {
      margin-bottom: ${viewportMargin.base};
    }

    @media (min-width: ${viewportV2.desktop}) {
      margin-bottom: ${viewportMargin.tablet};
    }
  `,

  Pagination: styled(PaginationButton)`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${colors.white};

    .hide {
      display: none;
    }
  `,
  LoadMoreButton: styled(Button)`
    width: 100%;
    max-width: 304px;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    color: ${colorsV2.white};
    background-image: linear-gradient(90deg, #fe8367 5.73%, #fe7688 100%);
    margin: 0 auto;

    &:active,
    &:focus,
    &:hover {
      opacity: 0.75;
      color: ${colorsV2.white};
      background-image: linear-gradient(90deg, #fe8367 5.73%, #fe7688 100%);
    }
  `
}

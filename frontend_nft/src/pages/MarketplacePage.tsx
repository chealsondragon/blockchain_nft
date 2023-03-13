import { useReactiveVar } from '@apollo/client'
import { Button, Input, Row, Col } from 'antd'
import React, { useState, useContext, useEffect, useCallback } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import { FooterCardMarketplace } from '../components/marketplace/FooterCardMarketplace'
import { FooterCardMarketplaceLoading } from '../components/marketplace/FooterCardMarketplaceLoading'
import { PaginationButton } from '../components/shared/PaginationButton'
import EmptyState from '../components/shared/EmptyState'
import { CardTemplate } from '../components/shared/CardTemplate'
import {
  marketplaceFiltersVar,
  sortingDirectionMarketplaceItemsVar,
  sortingFieldMarketplaceItemsVar
} from '../graphql/variables/MarketplaceVariable'
import { useChainConfig, useGlobalConfig } from '../hooks/ConfigHook'
import { MarketplaceERC20Item } from '../types/MarketplaceTypes'
import { colors, colorsV2, fonts, viewportMargin, viewport } from '../styles/variables'
import { DefaultPageTemplate } from './template/DefaultPageTemplate'
import * as FaIcons from 'react-icons/fa';
import { marketplaceService } from '../services/MarketplaceService'
import { MarketplaceFilter } from '../graphql/variables/MarketplaceVariable'
import emptyMessageIcon from '../assets/invoice.png'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from 'react-responsive-carousel'
import { CardTemplateV2 } from '../components/shared/CardTemplateV2'

export default function MarketplacePage() {
  const [isMenu, setisMenu] = useState(false);
  const [isResponsiveclose, setResponsiveclose] = useState(false);
  let sortingField = useReactiveVar(sortingFieldMarketplaceItemsVar)
  let sortingDirection = useReactiveVar(sortingDirectionMarketplaceItemsVar)
  const { paginationLimit } = useGlobalConfig()
  const { chainId } = useChainConfig()
  const marketplaceFilter = useReactiveVar(marketplaceFiltersVar)

  const [nfts, setNfts] = useState<MarketplaceERC20Item[]>([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [incomplete, setIncomplete] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [fracApiVersion, setFracApiVersion] = useState<1 | 2>(2)
  const { marketplaceBlacklist } = useChainConfig()

  const transactions: Array<any> = [
    //   {
    //   id: #1,
    //   Rank: 1,
    //   addr: '0xadcge43565aaasessa',
    //   Owners: 1,
    //   NFTs_Sold: 77Eth,
    //   Primary_Sales: 5Eth,
    //   Secondary_Sales: 6Eth,
    //   Total_Sales: 11.2Eth
    // }
  ]

  const loader = (
    <S.CardsContainer>
      {[...Array(paginationLimit)].map(() => (
        <CardTemplate key={`loading-${Math.random()}`} loading chainId={Number(chainId)}>
          <FooterCardMarketplaceLoading loading />
        </CardTemplate>
      ))}
    </S.CardsContainer>
  )

  const handleFilter = (e:any, val:any) => {
    marketplaceFiltersVar(val);
  }

  const [isSubMenuCreate, setSubMenuCreate] = useState(false);
  
  const setFilteredNfts = useCallback(
    (items: MarketplaceERC20Item[]) => {
      const filteredItems: MarketplaceERC20Item[] =
        chainId && marketplaceBlacklist ? items.filter(item => !marketplaceBlacklist.includes(item.id)) : items
      setNfts(filteredItems)
    },
    [marketplaceBlacklist, chainId]
  )

  const addItems = useCallback(
    (nftItems: MarketplaceERC20Item[]) => {
      setFilteredNfts(nfts.concat(nftItems))
    },
    [nfts, setFilteredNfts]
  )

  useEffect(() => {
    if (chainId && marketplaceFilter) {
      const getInitialNfts = async () => {
        setLoading(true)
        setHasMore(true)
        const nftItems = await marketplaceService(chainId, 2).getMarketplaceItems(
          sortingDirection,
          sortingField,
          paginationLimit,
          marketplaceFilter
        )

        setFilteredNfts(nftItems)
        setOffset(nftItems.length)
        setLoading(false)

        if (nftItems.length < paginationLimit) {
          setHasMore(false)
        }
      }
      getInitialNfts()
    } else {
      setLoading(false)
      setHasMore(false)
    }
  }, [chainId, marketplaceFilter, paginationLimit, setFilteredNfts, sortingDirection, sortingField])

  const loadMore = useCallback(
    async (customOffset?: number, customPaginationLimit?: number) => {
      if (chainId) {
        const nftItems = await marketplaceService(chainId, fracApiVersion).getMarketplaceItems(
          sortingDirection,
          sortingField,
          customPaginationLimit || paginationLimit,
          marketplaceFilter,
          customOffset || offset
        )

        if (nftItems) {
          const newOffset = offset + nftItems.length
          addItems(nftItems)
          setOffset(newOffset)
        }

        if (nftItems.length < paginationLimit && fracApiVersion === 2 && marketplaceFilter === MarketplaceFilter.all) {
          setFracApiVersion(1)
          if (paginationLimit - nftItems.length > 0) {
            setIncomplete(true)
          }
        } else if (fracApiVersion === 1 || marketplaceFilter !== MarketplaceFilter.all) {
          setHasMore(false)
          setLoading(false)
        }
      }
    },
    [addItems, chainId, marketplaceFilter, fracApiVersion, offset, paginationLimit, sortingDirection, sortingField]
  )

  useEffect(() => {
    if (incomplete) {
      loadMore(0, 100)
      setIncomplete(false)
    }
  }, [fracApiVersion, incomplete, loadMore])

  let createSubMenuClass = ["sub__menus"];
  if(isSubMenuCreate) {
      createSubMenuClass.push('sub__menus__Active');
  }else {
      createSubMenuClass.push('');
  }

  const sortHandle = (e:any, val:string) => {
    e.preventDefault();
    alert(val)
    setisMenu(isMenu === false ? true : false);
    setResponsiveclose(isResponsiveclose === false ? true : false);
  };

  const createSubmenu = () => {
      setSubMenuCreate(isSubMenuCreate === false ? true : false);
  };

  return (
    <>    
    <DefaultPageTemplate bgGray fullWidth> 
      <S.FilterDiv>
          <Col>
            <S.Button onClick={(e:any)=>handleFilter(e, 'all')}>All</S.Button>    
            <S.Button onClick={(e:any)=>handleFilter(e, 'category')}>Art</S.Button> 
            <S.Button onClick={(e:any)=>handleFilter(e, 'startAuction')}>Merchandize</S.Button>
            <S.Button onClick={(e:any)=>handleFilter(e, 'liveAuction')}>Memberships</S.Button>
            <S.Button onClick={(e:any)=>handleFilter(e, 'liveAuction')}>Utility</S.Button>
          </Col>
      </S.FilterDiv>
      <S.TrendDiv>Featured Memberships</S.TrendDiv>
      {!loading && !nfts.length && <EmptyState />}
      <InfiniteScroll next={loadMore} hasMore={hasMore} loader={loader} dataLength={nfts.length}>
        <S.CardsContainer>
          {nfts.map(nftItem => {
            let image:string = '';
            let animationUrl:string = '';
            let name:string = '';
            let nftcount:number = 0;
            let collectionId:string = '';

            if(typeof nftItem !== "undefined"){
              if(typeof nftItem.metadata !== "undefined"){
                image = String(nftItem.metadata.image)
              }
            }
            if(typeof nftItem !== "undefined"){
              if(typeof nftItem.metadata !== "undefined"){
                animationUrl = String(nftItem.metadata.animation_url)
              }
            }
            if(typeof nftItem !== "undefined"){
              if(typeof nftItem.metadata !== "undefined"){
                name = String(nftItem.metadata.name)
              }
            }
            if(typeof nftItem !== "undefined"){ 
              nftcount = typeof nftItem.nftCount !== "undefined"?nftItem.nftCount:0;
            }
            if(typeof nftItem !== "undefined"){
              if(typeof nftItem.target !== "undefined"){
                collectionId = String(nftItem.target.collection.id)
              }
            }
            
            return (
              <CardTemplateV2
                key={`${nftItem.id}`}
                image={image}
                animation_url={animationUrl}
                name={name}
                isBoxNftCount={nftcount}
                collectionAddress={collectionId}
                url={`/marketplace/${nftItem.id}/${nftItem.target.id}`}
                chainId={Number(chainId)}>
                <FooterCardMarketplace chainId={Number(chainId)} />
              </CardTemplateV2>
            )
          })}
        </S.CardsContainer>
      </InfiniteScroll>
      <S.TrendDiv>Featured Art</S.TrendDiv>
      <S.Carousel autoPlay={true} showThumbs={false} infiniteLoop={true} interval={5000} transitionTime={3000} showStatus={false} showIndicators={false}>
        <S.SlidePan>
          <S.Img src="assets/slide/2.jpg"></S.Img> 
          <S.CollectionName>
            MONOLICHE EXIBITIONS XIODKAD
          </S.CollectionName>
          <S.Created>
            created by
            <S.Creator>@nkgjsfel</S.Creator>
          </S.Created>
          <S.DetailPan>
            <S.Detail>
              Available NFTs
              <div>3</div>
            </S.Detail>
            <S.Detail>
              Sold NFTs
              <div>3</div>
            </S.Detail>
            <S.Detail>
              Total Sales
              <div>3</div>
            </S.Detail>
          </S.DetailPan>
        </S.SlidePan>
        <S.SlidePan>
          <S.Img src="assets/slide/3.jpg"></S.Img> 
          <S.CollectionName>
            ADULTS
          </S.CollectionName>
          <S.Created>
            created by
            <S.Creator>@nkgjsfel</S.Creator>
          </S.Created>
          <S.DetailPan>
            <S.Detail>
              Available NFTs
              <div>3</div>
            </S.Detail>
            <S.Detail>
              Sold NFTs
              <div>3</div>
            </S.Detail>
            <S.Detail>
              Total Sales
              <div>3</div>
            </S.Detail>
          </S.DetailPan>
        </S.SlidePan>
        <S.SlidePan>
          <S.Img src="assets/slide/4.jpg"></S.Img> 
          <S.CollectionName>
            FIGHTERS
          </S.CollectionName>
          <S.Created>
            created by
            <S.Creator>@nkgjsfel</S.Creator>
          </S.Created>
          <S.DetailPan>
            <S.Detail>
              Available NFTs
              <div>3</div>
            </S.Detail>
            <S.Detail>
              Sold NFTs
              <div>3</div>
            </S.Detail>
            <S.Detail>
              Total Sales
              <div>3</div>
            </S.Detail>
          </S.DetailPan>
        </S.SlidePan>
      </S.Carousel>
      {/* <Row style={{width: '100%'}}>
        <Col xs={24} sm={24} md={12} lg={11} xl={8}>
          <S.TrendDiv>Trending</S.TrendDiv>
        </Col>
        <Col xs={24} sm={24} md={1} lg={4} xl={9}></Col>
        <Col xs={24} sm={24} md={11} lg={9} xl={7}>
            <S.Filter onClick={(e:any)=>handleFilter(e, 'startAuction')}>1d</S.Filter>
            <S.Filter onClick={(e:any)=>handleFilter(e, 'startAuction')}>7d</S.Filter>
            <S.Filter onClick={(e:any)=>handleFilter(e, 'startAuction')}>30d</S.Filter>
            <S.Filter onClick={(e:any)=>handleFilter(e, 'startAuction')}>AllTime</S.Filter>
        </Col>
      </Row>
      <Row style={{width: '100%'}}>
        <S.TransactionsTable className={'scrollable-y'}>
            <thead>
              <tr>
                <th className='desktop'>Rank</th>
                <th className='desktop'></th>
                <th className='desktop'>Owners</th>
                <th className='desktop'>NFTs Sold</th>
                <th className='desktop'>Primary Sales</th>
                <th className='mobile'>Secondary Sales</th>
                <th className='mobile'>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td className='empty'>
                    <S.EmptyMessage>
                      <img src={emptyMessageIcon} alt='No transactions available.' />
                      <span>No Trending available.</span>
                    </S.EmptyMessage>
                  </td>
                </tr>
              )}
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className='desktop'>{transaction.Rank}</td>
                  <td className='desktop'>{transaction.addr}</td>
                  <td className='desktop'>{transaction.Owners}</td>
                  <td className='desktop'>
                    {transaction.NFTs_Sold}
                  </td>
                  <td className='desktop'>
                    {transaction.Primary_Sales}
                  </td>
                  <td className='mobile'>
                    {transaction.Secondary_Sales}
                  </td>
                  <td className='mobile'>
                    {transaction.Total_Sales}
                  </td>
                </tr>
              ))}
            </tbody>
          </S.TransactionsTable>
      </Row> */}
      <S.TrendDiv>Featured Category</S.TrendDiv>
      <S.Collections>
        <div className="block relative_position collection_pan">
          <div className="grid relative_position sub_pan">
            <div className="flex column_direction" style={{height: "100%", justifyContent: 'flex-end'}}>
              <div className="flex space" style={{height: "inherit", alignItems: 'flex-start'}}>
                <div className="flex" style={{flexGrow: 1, marginBottom: '24px', height: 'inherit', appearance: 'none', backgroundOrigin: 'padding-box', backgroundSize: 'auto'}}>
                  <div className="flex column_direction" style={{alignItems: 'flex-start', flex: '1 1 0%', height: 'inherit', minHeight: 'inherit', justifyContent: 'flex-end'}}>
                    <div className="block" style={{marginBottom: 'auto', marginRight: '16px'}}>
                      <div className="block" style={{backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '36px', padding: '15px'}}>
                        <div className="block" style={{backgroundColor: 'rgba(255,255,255,0.05)', backgroundImage: 'url("assets/gallery/1.jpg")', borderRadius: '24px', backgroundSize:'cover', backgroundPosition: '50% 50%', width:'128px', height: '128px'}}>
                        </div>
                      </div>
                    </div>
                    <div className="block" style={{paddingBottom: "24px", paddingTop: "24px"}}>
                        <div className="color_white flex center_align" style={{padding: '6px 16px', lineHeight: '20px', textAlign: 'left', fontSize: '16px', fontWeight: '500', gap: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '9999px'}}>MAGIC</div>
                      </div>
                      <div className="flex column_direction">
                        <h2 className="block color_white" style={{margin:'0px', padding: '0px', marginBottom: '8px', fontSize: '32px', letterSpacing: '-0.002em', fontWeight: '600', wordBreak: 'break-word', maxWidth: '720px'}}>The Incantatio</h2>
                        <div className="center_align flex">
                          <p className="color_white" style={{fontWeight: 600}}>7 NFTs</p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="flex" style={{marginTop: "24px"}}>
                <div className="block">
                  <div className="flex center_align" style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: '0px 8px', height: '48px', appearance: 'none', borderRadius: '9999px', willChange: 'transform', fontWeight: '600', textAlign: 'center', justifyContent: 'center'}}>
                    <div className="flex center_align" style={{maxWidth: '100%'}}>
                      <div className="block" style={{backgroundColor: 'rgba(0,0,0,0.25)', backgroundImage: 'url("assets/gallery/1.jpg")', backgroundPosition: 'center center', backgroundSize: 'cover', width: '32px', height: '32px', borderRadius: '9999px', marginRight: '10px'}}></div>
                      <span>@ZII</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{overflow: 'scroll'}}>
              <div className="grid cards">
                <CardTemplate
                  key={`1_col`}
                  image={'assets/gallery/5.jpg'}
                  animation_url={'assets/gallery/5.jpg'}
                  name={'dfe'}
                  isBoxNftCount={3}
                  collectionAddress={'1'}
                  url={``}
                  chainId={Number(chainId)}>
                  <FooterCardMarketplace chainId={Number(chainId)} />
                </CardTemplate>
                <CardTemplate
                  key={`2_col`}
                  image={'assets/gallery/6.jpg'}
                  animation_url={'assets/gallery/6.jpg'}
                  name={'dfe'}
                  isBoxNftCount={3}
                  collectionAddress={'1'}
                  url={``}
                  chainId={Number(chainId)}>
                  <FooterCardMarketplace chainId={Number(chainId)} />
                </CardTemplate>
                <CardTemplate
                  key={`3_col`}
                  image={'assets/gallery/7.jpg'}
                  animation_url={'assets/gallery/7.jpg'}
                  name={'dfe'}
                  isBoxNftCount={3}
                  collectionAddress={'1'}
                  url={``}
                  chainId={Number(chainId)}>
                  <FooterCardMarketplace chainId={Number(chainId)} />
                </CardTemplate>
              </div>
            </div>
          </div>
        </div>
      </S.Collections>
      <S.Collections>
        <div className="block relative_position collection_pan">
          <div className="grid relative_position sub_pan">
            <div className="flex column_direction" style={{height: "100%", justifyContent: 'flex-end'}}>
              <div className="flex space" style={{height: "inherit", alignItems: 'flex-start'}}>
                <div className="flex" style={{flexGrow: 1, marginBottom: '24px', height: 'inherit', appearance: 'none', backgroundOrigin: 'padding-box', backgroundSize: 'auto'}}>
                  <div className="flex column_direction" style={{alignItems: 'flex-start', flex: '1 1 0%', height: 'inherit', minHeight: 'inherit', justifyContent: 'flex-end'}}>
                    <div className="block" style={{marginBottom: 'auto', marginRight: '16px'}}>
                      <div className="block" style={{backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '36px', padding: '15px'}}>
                        <div className="block" style={{backgroundColor: 'rgba(255,255,255,0.05)', backgroundImage: 'url("assets/gallery/1.jpg")', borderRadius: '24px', backgroundSize:'cover', backgroundPosition: '50% 50%', width:'128px', height: '128px'}}>
                        </div>
                      </div>
                    </div>
                    <div className="block" style={{paddingBottom: "24px", paddingTop: "24px"}}>
                        <div className="color_white flex center_align" style={{padding: '6px 16px', lineHeight: '20px', textAlign: 'left', fontSize: '16px', fontWeight: '500', gap: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '9999px'}}>COLOR</div>
                      </div>
                      <div className="flex column_direction">
                        <h2 className="block color_white" style={{margin:'0px', padding: '0px', marginBottom: '8px', fontSize: '32px', letterSpacing: '-0.002em', fontWeight: '600', wordBreak: 'break-word', maxWidth: '720px'}}>The Essence of Color by Sarfo</h2>
                        <div className="center_align flex">
                          <p className="color_white" style={{fontWeight: 600}}>35 NFTs</p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="flex" style={{marginTop: "24px"}}>
                <div className="block">
                  <div className="flex center_align" style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: '0px 8px', height: '48px', appearance: 'none', borderRadius: '9999px', willChange: 'transform', fontWeight: '600', textAlign: 'center', justifyContent: 'center'}}>
                    <div className="flex center_align" style={{maxWidth: '100%'}}>
                      <div className="block" style={{backgroundColor: 'rgba(0,0,0,0.25)', backgroundImage: 'url("assets/gallery/1.jpg")', backgroundPosition: 'center center', backgroundSize: 'cover', width: '32px', height: '32px', borderRadius: '9999px', marginRight: '10px'}}></div>
                      <span>@thebridge</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{overflow: 'scroll', width: 'inherit'}}>
              <div className="grid cards">
                <CardTemplate
                  key={`1_col`}
                  image={'assets/gallery/8.jpg'}
                  animation_url={'assets/gallery/8.jpg'}
                  name={'dfe'}
                  isBoxNftCount={3}
                  collectionAddress={'1'}
                  url={``}
                  chainId={Number(chainId)}>
                  <FooterCardMarketplace chainId={Number(chainId)} />
                </CardTemplate>
                <CardTemplate
                  key={`2_col`}
                  image={'assets/gallery/8.jpg'}
                  animation_url={'assets/gallery/5.jpg'}
                  name={'dfe'}
                  isBoxNftCount={3}
                  collectionAddress={'1'}
                  url={``}
                  chainId={Number(chainId)}>
                  <FooterCardMarketplace chainId={Number(chainId)} />
                </CardTemplate>
                <CardTemplate
                  key={`3_col`}
                  image={'assets/gallery/8.jpg'}
                  animation_url={'assets/gallery/5.jpg'}
                  name={'dfe'}
                  isBoxNftCount={3}
                  collectionAddress={'1'}
                  url={``}
                  chainId={Number(chainId)}>
                  <FooterCardMarketplace chainId={Number(chainId)} />
                </CardTemplate>
              </div>
            </div>
          </div>
        </div>
      </S.Collections>
      <S.Collections>
        <div className="block relative_position collection_pan">
          <div className="grid relative_position sub_pan">
            <div className="flex column_direction" style={{height: "100%", justifyContent: 'flex-end'}}>
              <div className="flex space" style={{height: "inherit", alignItems: 'flex-start'}}>
                <div className="flex" style={{flexGrow: 1, marginBottom: '24px', height: 'inherit', appearance: 'none', backgroundOrigin: 'padding-box', backgroundSize: 'auto'}}>
                  <div className="flex column_direction" style={{alignItems: 'flex-start', flex: '1 1 0%', height: 'inherit', minHeight: 'inherit', justifyContent: 'flex-end'}}>
                    <div className="block" style={{marginBottom: 'auto', marginRight: '16px'}}>
                      <div className="block" style={{backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '36px', padding: '15px'}}>
                        <div className="block" style={{backgroundColor: 'rgba(255,255,255,0.05)', backgroundImage: 'url("assets/gallery/1.jpg")', borderRadius: '24px', backgroundSize:'cover', backgroundPosition: '50% 50%', width:'128px', height: '128px'}}>
                        </div>
                      </div>
                    </div>
                    <div className="block" style={{paddingBottom: "24px", paddingTop: "24px"}}>
                        <div className="color_white flex center_align" style={{padding: '6px 16px', lineHeight: '20px', textAlign: 'left', fontSize: '16px', fontWeight: '500', gap: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '9999px'}}>NSRR</div>
                      </div>
                      <div className="flex column_direction">
                        <h2 className="block color_white" style={{margin:'0px', padding: '0px', marginBottom: '8px', fontSize: '32px', letterSpacing: '-0.002em', fontWeight: '600', wordBreak: 'break-word', maxWidth: '720px'}}>Numsurr</h2>
                        <div className="center_align flex">
                          <p className="color_white" style={{fontWeight: 600}}>17 NFTs</p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="flex" style={{marginTop: "24px"}}>
                <div className="block">
                  <div className="flex center_align" style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: '0px 8px', height: '48px', appearance: 'none', borderRadius: '9999px', willChange: 'transform', fontWeight: '600', textAlign: 'center', justifyContent: 'center'}}>
                    <div className="flex center_align" style={{maxWidth: '100%'}}>
                      <div className="block" style={{backgroundColor: 'rgba(0,0,0,0.25)', backgroundImage: 'url("assets/gallery/1.jpg")', backgroundPosition: 'center center', backgroundSize: 'cover', width: '32px', height: '32px', borderRadius: '9999px', marginRight: '10px'}}></div>
                      <span>@numsurr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{overflow: 'scroll'}}>
              <div className="grid cards">
                <CardTemplate
                  key={`1_col`}
                  image={'assets/gallery/11.jpg'}
                  animation_url={'assets/gallery/5.jpg'}
                  name={'dfe'}
                  isBoxNftCount={3}
                  collectionAddress={'1'}
                  url={``}
                  chainId={Number(chainId)}>
                  <FooterCardMarketplace chainId={Number(chainId)} />
                </CardTemplate>
                <CardTemplate
                  key={`2_col`}
                  image={'assets/gallery/12.jpg'}
                  animation_url={'assets/gallery/5.jpg'}
                  name={'dfe'}
                  isBoxNftCount={3}
                  collectionAddress={'1'}
                  url={``}
                  chainId={Number(chainId)}>
                  <FooterCardMarketplace chainId={Number(chainId)} />
                </CardTemplate>
                <CardTemplate
                  key={`3_col`}
                  image={'assets/gallery/13.jpg'}
                  animation_url={'assets/gallery/5.jpg'}
                  name={'dfe'}
                  isBoxNftCount={3}
                  collectionAddress={'1'}
                  url={``}
                  chainId={Number(chainId)}>
                  <FooterCardMarketplace chainId={Number(chainId)} />
                </CardTemplate>
              </div>
            </div>
          </div>
        </div>
      </S.Collections>
      <S.Collections>
        <div className="block relative_position collection_pan">
          <div className="grid relative_position sub_pan">
            <div className="flex column_direction" style={{height: "100%", justifyContent: 'flex-end'}}>
              <div className="flex space" style={{height: "inherit", alignItems: 'flex-start'}}>
                <div className="flex" style={{flexGrow: 1, marginBottom: '24px', height: 'inherit', appearance: 'none', backgroundOrigin: 'padding-box', backgroundSize: 'auto'}}>
                  <div className="flex column_direction" style={{alignItems: 'flex-start', flex: '1 1 0%', height: 'inherit', minHeight: 'inherit', justifyContent: 'flex-end'}}>
                    <div className="block" style={{marginBottom: 'auto', marginRight: '16px'}}>
                      <div className="block" style={{backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '36px', padding: '15px'}}>
                        <div className="block" style={{backgroundColor: 'rgba(255,255,255,0.05)', backgroundImage: 'url("assets/gallery/1.jpg")', borderRadius: '24px', backgroundSize:'cover', backgroundPosition: '50% 50%', width:'128px', height: '128px'}}>
                        </div>
                      </div>
                    </div>
                    <div className="block" style={{paddingBottom: "24px", paddingTop: "24px"}}>
                        <div className="color_white flex center_align" style={{padding: '6px 16px', lineHeight: '20px', textAlign: 'left', fontSize: '16px', fontWeight: '500', gap: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '9999px'}}>FIGHT</div>
                      </div>
                      <div className="flex column_direction">
                        <h2 className="block color_white" style={{margin:'0px', padding: '0px', marginBottom: '8px', fontSize: '32px', letterSpacing: '-0.002em', fontWeight: '600', wordBreak: 'break-word', maxWidth: '720px'}}>Strong Winner</h2>
                        <div className="center_align flex">
                          <p className="color_white" style={{fontWeight: 600}}>23 NFTs</p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="flex" style={{marginTop: "24px"}}>
                <div className="block">
                  <div className="flex center_align" style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: '0px 8px', height: '48px', appearance: 'none', borderRadius: '9999px', willChange: 'transform', fontWeight: '600', textAlign: 'center', justifyContent: 'center'}}>
                    <div className="flex center_align" style={{maxWidth: '100%'}}>
                      <div className="block" style={{backgroundColor: 'rgba(0,0,0,0.25)', backgroundImage: 'url("assets/gallery/1.jpg")', backgroundPosition: 'center center', backgroundSize: 'cover', width: '32px', height: '32px', borderRadius: '9999px', marginRight: '10px'}}></div>
                      <span>@winner</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{overflow: 'scroll'}}>
              <div className="grid cards">
                <CardTemplate
                  key={`1_col`}
                  image={'assets/gallery/14.jpg'}
                  animation_url={'assets/gallery/5.jpg'}
                  name={'dfe'}
                  isBoxNftCount={3}
                  collectionAddress={'1'}
                  url={``}
                  chainId={Number(chainId)}>
                  <FooterCardMarketplace chainId={Number(chainId)} />
                </CardTemplate>
                <CardTemplate
                  key={`2_col`}
                  image={'assets/gallery/15.jpg'}
                  animation_url={'assets/gallery/5.jpg'}
                  name={'dfe'}
                  isBoxNftCount={3}
                  collectionAddress={'1'}
                  url={``}
                  chainId={Number(chainId)}>
                  <FooterCardMarketplace chainId={Number(chainId)} />
                </CardTemplate>
                <CardTemplate
                  key={`3_col`}
                  image={'assets/gallery/16.jpg'}
                  animation_url={'assets/gallery/5.jpg'}
                  name={'dfe'}
                  isBoxNftCount={3}
                  collectionAddress={'1'}
                  url={``}
                  chainId={Number(chainId)}>
                  <FooterCardMarketplace chainId={Number(chainId)} />
                </CardTemplate>
              </div>
            </div>
          </div>
        </div>
      </S.Collections>
    </DefaultPageTemplate>
    </>
  )
}

export const S = {
  TrendDiv: styled.div `
    margin: 20px 0px;
    font-size: 28px;
    font-weight: 400;
    color: #000;
    font-family: LULO, Suisse, Suisse Fallback
  `,
  ExpDiv: styled.div `
    font-size: 33px;
    font-weight: 600;
    margin-top: -7px;
    width: 150px;
    display: inline-block;
    color: ${props => props.theme.black};
  `,
  FilterDiv: styled.div `
    width: 100%;
    display: flex;
    box-shadow: none;
    margin: 40px 0px 20px;
    @media (min-width: ${props => props.theme.viewport.desktop}) {
      width: calc(100% - 150px);
      display: inline-flex;
    }
  `,
  SortLink: styled.div`
    color: ${props => props.theme.black};
    margin: 0px;
    background: ${props => props.theme.white};
    width: 100%;
    border: 0px;
    font-size: 13px;
    line-height: 1.5rem;
    &:hover,
    &:active,
    &:focus {
      background: ${props => props.theme.white};
    }
  `,
  SortUl: styled.ul `
    background: ${props => props.theme.white};
    width: 110px;
    margin-left: -10px;
    margin-top: 10px;
    @media (min-width: ${props => props.theme.viewport.desktop}) {
      margin-left: 5px;
    }
  `,
  SortLi: styled.li `
  
  `,
  SortDiv: styled.div `
    width: 140px;
    text-align: right;
  `,
  Row: styled(Row)`
    width: calc(100% - 140px);
  `,
  SliderDiv: styled.div `
    margin: 1.3rem 0 1.3rem 0;
    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      margin: 2rem 0 2rem 0;
    }
  `,
  Title: styled.div `
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${(props:any)=>props.theme.black}
  `,
  Button: styled(Button)`
    background: ${props=>props.theme.white};
    color: ${props=>props.theme.black};
    font-weight: bold;
    border: 1px solid ${props=>props.theme.gray['1']};
    border-radius: 10px !important;
    padding: 5px 15px 7px 15px !important;
    cursor: pointer !important;
    height: 40px;
    width: 140px;
    margin: 10px 10px;
    &:hover,
    &:active,
    &:focus {
      background-color: rgb(22, 22, 22);
      color: white;
    }
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      margin-top: 0px;
      margin-right: 0px !important;
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
  CardsContainer: styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 4vw;
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
  `,
  TransactionsTable: styled.table`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: 20px 0px;
    padding: 10px;
    &.scrollable-y {
      > thead {
        > tr {
          > th {
            &:last-child {
              text-align: left;
            }
          }
        }
      }
      > tbody {
        overflow-y: scroll;
        height: 238px;
        > tr {
          > td {
            &:last-child {
              text-align: center;
            }
          }
        }
      }
    }
    > thead {
      display: flex;
      > tr {
        display: flex;
        width: 100%;
        gap: 8px;
        > th {
          &:last-child {
            text-align: right;
            &.empty {
              text-align: center;
            }
          }
          font-size: 16px;
          line-height: 16px;
          color: ${props=>props.theme.gray['3']};
          font-weight: 400;
          &.desktop {
            display: block;
            width: 25%;
            @media (max-width: ${viewport.sm}) {
              display: none;
            }
          }
          &.mobile {
            display: none;
            &:not(:nth-child(2)) {
              width: 40%;
            }
            &:nth-child(2) {
              width: 30%;
            }
            @media (max-width: ${viewport.sm}) {
              display: block;
            }
          }
          @media (max-width: ${viewport.sm}) {
            font-size: 10px;
            line-height: 13px;
          }
          &.desktop {
            display: block;
            @media (max-width: ${viewport.sm}) {
              display: none;
            }
          }
          &.mobile {
            display: none;
            @media (max-width: ${viewport.sm}) {
              display: block;
            }
          }
        }
      }
    }
    > tbody {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      > tr {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        gap: 8px;
        > td {
          text-align: center;
          color: ${props=>props.theme.black};
          font-size: 16px;
          line-height: 20px;
          font-weight: 500;
          padding: 20px 0;
          word-break: break-all;
          @media (max-width: ${viewport.sm}) {
            font-size: 10px;
            line-height: 13px;
          }
          &.desktop {
            display: block;
            width: 25%;
            @media (max-width: ${viewport.sm}) {
              display: none;
            }
          }
          &.mobile {
            display: none;
            &:not(:nth-child(2)) {
              width: 40%;
            }
            &:nth-child(2) {
              width: 30%;
            }
            @media (max-width: ${viewport.sm}) {
              display: block;
            }
          }
          &.empty {
            width: 100%;
            height: 100%;
            border-bottom: none;
            padding: 34px 0 18px 0;
          }
          &:last-child {
            text-align: right;
            &.empty {
              text-align: center;
            }
          }
        }
      }
    }
  `,
  EmptyMessage: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: ${props=>props.theme.gray['3']};
    > img {
      width: 32px;
      height: 32px;
    }
  `,
  Filter: styled.div`
    background: ${props=>props.theme.white};
    color: ${props=>props.theme.black};
    font-weight: bold;
    border: 1px solid ${props=>props.theme.gray['1']};
    border-radius: 10px !important;
    padding: 5px 15px 7px 15px !important;
    cursor: pointer !important;
    display: inline-block;
    margin: 25px 10px 0px;
    &:hover,
    &:active,
    &:focus {
      background-color: rgb(155, 155, 155);
    }
  `,
  SlidePan: styled.div`
    position: relative;
    padding: 0px 10px;
  `,
  CollectionName: styled.p`
    position: absolute;
    left: 50%;
    width: 100%;
    letter-spacing: 5px;
    font-weight: bold;
    color: rgb(200,200,200);
    transform: translateX(-50%);
    padding: 0px 2px;
    @media (min-width: 400px) {
      font-size: 25px;
      top: 30%;
    }
    @media (min-width: 600px) {
      font-size: 30px;
    }
    @media (min-width: 800px) {
      font-size: 35px;
    }
    @media (min-width: 1000px) {
      font-size: 40px;
    }
    @media (min-width: 1200px) {
      font-size: 45px;
    }
    @media (min-width: 1400px) {
      font-size: 50px;
    }  
    @media (min-width: 1600px) {
      font-size: 60px;
    }   
    @media (min-width: 1900px) {
      font-size: 60px;
    }   
  `,
  Created: styled.div`
    position: absolute;
    left: 50%;
    letter-spacing: 2px;
    font-weight: bold;
    color: rgb(200,200,200);
    transform: translateX(-50%);
    width: 100%;
    @media (min-width: 400px) {
      font-size: 10px;
      top: 62%;
    }
    @media (min-width: 600px) {
      font-size: 12px;
      bottom
    }
    @media (min-width: 800px) {
      font-size: 16px;
      top: 50%;
    }
    @media (min-width: 1000px) {
      font-size: 18px;
      top: 50%;
    }
    @media (min-width: 1200px) {
      font-size: 20px;
      top: 50%;
    }
    @media (min-width: 1400px) {
      font-size: 22px;
      top: 50%;
    }  
    @media (min-width: 1600px) {
      font-size: 24px;
    }   
    @media (min-width: 1900px) {
      font-size: 26px;
      top: 50%;
    }   
  `,
  Creator: styled.p`
    margin-left: 10px;
    background-color: rgba(200,200,200,0.4);
    border-radius: 15px;
    padding: 5px 10px;
    color: white;
    display: inline-block;
  `,
  Detail: styled.div`
    position: relative;
    display: inline-block;
    letter-spacing: 2px;
    font-weight: bold;
    font-size: 14px;
    color: white;
    bottom: 0;
    border-left: 1px solid rgba(255,255,255,0.2);
    border-right: 1px solid rgba(255,255,255,0.2);
    text-align: center;
    padding: 0px 10px;
    @media (max-width: 600px) {
      font-size: 12px;
      display: none;
    }
    @media (max-width: 400px) {
      font-size: 14px;
      display: none;
    }
    @media (min-width: 800px) {
      font-size: 14px;
    }
    @media (min-width: 1000px) {
      font-size: 14px;
    }
    @media (min-width: 1200px) {
      font-size: 14px;
    }
    @media (min-width: 1400px) {
      font-size: 14px;
    }  
    @media (min-width: 1600px) {
      font-size: 14px;
      display: inline-block;
    }   
    @media (min-width: 1900px) {
      font-size: 14px;
      display: inline-block;
    }   
  `,
  DetailPan: styled.div`
    position: absolute;
    left: 0%;
    bottom: 0;
    width: 100%;
    margin-bottom: 20px;
  `,
  Img: styled.img`
    border-radius: 10px;
    @media (max-width: 799px) {
      height: 500px;
    }
    @media (max-width: 599px) {
      height: 350px;
    }
  `,
  Carousel: styled(Carousel)`
    .control-arrow {
      margin: 0px 10px;
    }
  `,
  Collections: styled.div`
    box-sizing: content-box;
    display: block;
    .block {
      box-sizing: content-box;
      display: block;
    }
    .flex {
      box-sizing: content-box;
      display: flex;
    }
    .relative_position {
      position: relative;
    }
    .space {
      justify-content: space-between;
    }
    .collection_pan {
      background-color: black;
      background-image: url("");
      background-position: center center;
      background-size: cover;
      margin-bottom: 24px;
      overflow-x: hidden;
      overflow-y: hidden;
      padding: 48px;
      border-radius: 15px;
    }
    .grid {
      display: grid;
      box-sizing: content-box;
    }
    .sub_pan {
      grid-template-columns: 1fr 3fr;
      gap: 32px;
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }
    .column_direction {
      flex-direction: column;
    }
    .color_white {
      color: white;
    }
    span {
      box-sizing: content-box;
      color: white;
      font-size: 14px;
      font-weight: 600;
      overflow-x: hidden;
      overflow-y: hidden;
      text-align: center;
      text-overflow: ellipsis;
    }
    .center_align {
      align-items: center;
    }
    .cards {
      grid-template-columns: repeat(3, 1fr);
      padding-bottom: 0px;
      gap: 32px;
      
    }
  `
}

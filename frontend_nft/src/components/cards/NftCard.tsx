import { useReactiveVar } from '@apollo/client'
import { Skeleton, Spin } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import notFound from '../../assets/notfound.svg'
import { chainIdVar } from '../../graphql/variables/WalletVariable'
import { safeIpfsUrl } from '../../services/UtilService'
import { colors, fonts, viewport } from '../../styles/variables'

export interface NftCardProps {
  name?: string
  typeName?: string
  image?: string
  url?: string
  loading?: boolean
  className?: string
  fractionalize?: boolean
  address?: string
  exitPrice?: string
  priceDollar?: string
  exitCurrency?: string
  size?: 'small' | 'medium' | 'large'
  metadata?: {
    name?: string
    description?: string
    image?: string
    animation_url?: string
    animationType?: string
    asset_contract?: {
      name: string
    }
  }
}

export const NftCard: React.FC<NftCardProps> = ({
  name,
  typeName,
  image,
  loading,
  url,
  className,
  fractionalize,
  exitPrice,
  priceDollar,
  exitCurrency,
  size,
  metadata
}: NftCardProps) => {
  const chainId = useReactiveVar(chainIdVar)
  const metadataImage = image || (typeof metadata !== "undefined"?metadata.image: false)
  const [selectedImage, setSelectedImage] = useState((metadataImage && safeIpfsUrl(metadataImage)) || notFound)

  const onImageError = () => {
    setSelectedImage(notFound)
  }

  const isMovieType = (): boolean => {
      if (typeof metadata !== "undefined")
       return metadata.animationType != 'image'
      else
       return false;
  }

  return (
    <S.Card className={`${className} ${size || ''}`} to={`${url || '#'}`}>
      <S.BoxImage className={metadataImage === '' ? 'bg-fail' : ''}>
        {isMovieType() ? (
          <S.NFTVideo autoPlay muted loop preload='none'>
            <source src={(typeof metadata !== "undefined"?metadata.animation_url:false) || image} />
            Your browser does not support the video tag.
          </S.NFTVideo>
        ) : (
          <S.Img
            src={selectedImage}
            className={selectedImage === notFound ? 'img-fail' : ''}
            onError={onImageError}
            alt={name || 'not found'}
            hidden={!!loading}
            loading='lazy'
          />
        )}
        <Spin indicator={<Skeleton.Avatar active size={64} shape='circle' />} spinning={!!loading} />
      </S.BoxImage>
      <S.BoxInfo>
        <S.Wrapper>
          <S.Content>
            <Skeleton className='full-width-skeleton' loading={loading} active paragraph={{ rows: 0 }}>
              <S.Label>{typeName}</S.Label>
            </Skeleton>
          </S.Content>
          {name && (
            <S.Content>
              <Skeleton className='full-width-skeleton' loading={!!loading} active paragraph={{ rows: 0 }}>
                <S.Name>{`${typeof metadata !== "undefined"?metadata.name: ''}`}</S.Name>
              </Skeleton>
            </S.Content>
          )}
        </S.Wrapper>
        <S.Wrapper>
          {!fractionalize && (
            <S.Content>
              <Skeleton className='full-width-skeleton' loading={!!loading && !fractionalize} active paragraph={{ rows: 0 }}>
                <S.Label>NFT Price</S.Label>
              </Skeleton>
            </S.Content>
          )}

          {!fractionalize && (
            <S.Content>
              <Skeleton className='full-width-skeleton' loading={!!loading && !fractionalize} active paragraph={{ rows: 0 }}>
                <S.Price>
                  {`${Number(exitPrice).toLocaleString('en-us', { maximumFractionDigits: 2 })} `}
                  <S.Symbol>{typeof exitCurrency !== "undefined"?exitCurrency.toUpperCase(): ''}</S.Symbol>
                </S.Price>
              </Skeleton>
            </S.Content>
          )}
        </S.Wrapper>
      </S.BoxInfo>
    </S.Card>
  )
}

const S = {
  Card: styled(Link)`
    min-width: 304px;
    padding: 16px;
    height: 416px;
    border: 1px solid ${props=>props.theme.gray['2']};
    box-sizing: border-box;
    border-radius: 8px;
    justify-content: center;
    box-shadow: 1px 1px 5px hsla(0, 0%, 0%, 0.05);
    background: ${props=>props.theme.white};

    .hidden {
      display: none;
    }

    &.small {
      height: 370px;
    }

    &:hover {
      cursor: pointer;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow ease-in 250ms;
    }

    @media (max-width: ${viewport.md}) {
      margin: 0 auto;
    }
  `,
  BoxImage: styled.div`
    width: 100%;
    height: 270px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 8px;
    align-items: center;

    .ant-skeleton {      
      display: flex;
      align-items: center;
    }
  `,
  Img: styled.img`
    max-width: 100%;
    max-height: 270px;
    width: auto;
    height: auto;
    -webkit-user-drag: none;
    border-radius: 4px;
  `,
  NFTVideo: styled.video`
    max-width: 100%;
    max-height: 270px;
  `,
  NFTAudio: styled.audio`
    max-width: 100%;
    max-height: 270px;
  `,
  BoxInfo: styled.div`
    border-top: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .full-width-skeleton .ant-skeleton-content .ant-skeleton-title {
      width: 100% !important;
    }
    .ant-skeleton {
      height: 26px;
      display: flex;
      align-items: center;
    }
  `,
  Label: styled.label`
    color: ${props=>props.theme.gray['3']};
    font-size: 11px;
    font-weight: 400;
    line-height: 13px;
    margin-top: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  Name: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    color: ${props=>props.theme.gray['4']};

    margin-top: 4px;
    height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  Informative: styled.span`
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: 400;
    font-size: 12px !important;
    line-height: 18px;
    color: ${colors.gray1};
  `,
  Content: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    span {
      font-family: ${fonts.nunito};
      font-style: normal;
      font-weight: 400;
    }
    .hidden-collection {
      display: none;
    }

    .invisible {
      display: none;
      margin-top: 16px;
    }
  `,

  Price: styled.span`
    color: ${colors.gray2};
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  `,
  Symbol: styled.small`
    font-size: 8px;
  `,
  Wrapper: styled.div`
    display: flex;
    flex-direction: column;
  `
}

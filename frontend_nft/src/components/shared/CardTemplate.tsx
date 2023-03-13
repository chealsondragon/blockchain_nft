import { Skeleton, Spin } from 'antd'
import React, { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import notFound from '../../assets/notfound.svg'
import { imgLH3, safeIpfsUrl } from '../../services/UtilService'
import { colorsV2, fonts, viewportV2 } from '../../styles/variables'

export type CardTemplateProps = {
  image?: string
  animation_url?: string
  className?: string
  name?: string
  collectionAddress?: string
  ownership?: string
  isBoxNftCount?: number
  chainId: number
  url?: string
  loading?: boolean
  children?: ReactNode
}

export function CardTemplate({
  image,
  name,
  isBoxNftCount,
  collectionAddress,
  ownership,
  loading,
  className,
  chainId,
  url,
  children
}: CardTemplateProps) {
  const metadataImage = image
  const [selectedImage, setSelectedImage] = useState((metadataImage) || notFound) //&& safeIpfsUrl(metadataImage)
  const onImageError = () => {
    setSelectedImage(notFound)
  }
  return (
    <S.Card>
      <Link to={`${url || '#'}`}>
        <S.Content>
          <Spin indicator={<Skeleton.Avatar active size={64} shape='circle' />} spinning={!!loading} />
          <S.Img
            src={imgLH3(selectedImage, 400)}
            className={selectedImage === notFound ? 'img-fail' : ''}
            onError={onImageError}
            alt={name || 'not found'}
            hidden={!!loading}
            loading='lazy'
          />
        </S.Content>
        <div className={className}>
          <div className="flex center_align space relative_position">
            <div className="block" style={{minWidth: "0px"}}>
              <div className="block">
                <div className="owner">
                  <div className="block flex center_align icon_pan">
                    <div className="block owner_icon"></div>
                    <span className='owner_name'>@sisab</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex center_align space relative_position">
            <div className="block" style={{minWidth: "0px"}}>
              <div className="block">
                <div className="owner">
                  <div className="block flex center_align icon_pan">
                    <span className='owner_name'>Buy Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex center_align space relative_position">
            <div className="block" style={{minWidth: "0px"}}>
              <div className="block">
                <div className="owner" style={{paddingTop: '0px', marginTop: '-10px'}}>
                  <div className="block flex center_align icon_pan">
                    <span className='owner_name black'>0.07ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </S.Card>
  )
}

export const S = {
  Card: styled.div`
    width: 100%;
    height: auto;
    max-width: 400px;
    min-width: 300px;
    border: 1px solid ${props=>props.theme.gray[1]};
    box-sizing: border-box;
    border-radius: 16px;
    background: ${props=>props.theme.white};
    margin: 0 auto;
    &:hover {
      cursor: pointer;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow ease-in 250ms;
    }

    .ant-spin.ant-spin-spinning {
      width: 100%;
      height: auto;
      max-height: 400px;
      margin: auto;
    }
    .owner {
      align-items: center;
      appearance: none;
      backdrop-filter: blur(10px);
      background-color: rgba(255,255,255,0.2);
      border-radius: 10px;
      box-sizing: border-box;
      color: white;
      display: flex;
      font-size: 14px;
      font-weight: 600;
      height: 36px;
      justify-content: center;
      padding: 0px 15px;
      text-align: center;
      will-change: transform;
      margin-top: 8px;
    }
    .owner_icon {
      background-image: url("assets/gallery/1.jpg");
      background-position-x: 50%;
      background-position-y: 50%;
      background-size: cover;
      height: 24px;
      margin-right: 10px;
      width: 24px;
      border-radius: 9999px;
    }
    .icon_pan {
      max-width: 100%;
    }
    .center_align {
      align-items: center;
    }
    .column_direction {
      flex-direction: column;
    }
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
    a {
      text-decoration: none;
    }
    .owner_name{
      box-sizing: content-box;
      color: rgba(0,0,0,0.7);
      font-size: 18px;
      font-weight: 600;
      overflow-x: hidden;
      overflow-y: hidden;
      text-align: center;
      text-overflow: ellipsis;
    }
    .black {
      color: rgba(0,0,0,1) !important;
    }
  `,
  Content: styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    border-top-right-radius: 16px;
    border-top-left-radius: 16px;
    min-height: 250px;

    @media (min-width: ${viewportV2.tablet}) {
      min-height: 250px;
    }

    @media (min-width: ${viewportV2.desktop}) {
      min-height: 300px;
    }
  `,
  Img: styled.img`
    width: 100%;
    height: auto;
    max-height: 400px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    -webkit-user-drag: none;
  `,
  LoadArea: styled.div`
    width: 1000%;
  `
}

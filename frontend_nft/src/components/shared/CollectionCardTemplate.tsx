import { Skeleton, Spin } from 'antd'
import React, { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import notFound from '../../assets/notfound.svg'
import { imgLH3, safeIpfsUrl } from '../../services/UtilService'
import { colorsV2, fonts, viewportV2 } from '../../styles/variables'

export type CollectionCardTemplateProps = {
  banner?: string
  logo?:string
  name?: string
  ownership?: string
  itemCount?: number
  url?: string
  className?: string
  loading?: boolean
  id?: string
  children?: ReactNode
}

export function CollectionCardTemplate({
  banner,
  name,
  itemCount,
  ownership,
  loading,
  url,
  className,
  id,
  children
}: CollectionCardTemplateProps) {
  const metadataImage = banner
  const [selectedImage, setSelectedImage] = useState(metadataImage || notFound)
  const onImageError = () => {
    console.log("dddd")
    setSelectedImage(notFound)
  }
  return (
    <S.Card>
      <Link to={{
        pathname: url,
        search: `?collectionId=${id}`
      }}>
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
        <S.Tags>
          {name && <S.Tag>{name}</S.Tag>}
          <S.Tag>{itemCount} Items</S.Tag>
        </S.Tags>
        <div className={className}>{children}</div>
      </Link>
    </S.Card>
  )
}

export const S = {
  Card: styled.div`
    width: 100%;
    height: auto;
    max-width: 400px;
    border: 1px solid ${colorsV2.gray[1]};
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
    height: 230px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    -webkit-user-drag: none;
    @media (min-width: ${viewportV2.tablet}) {
      height: 230px;
    }

    @media (min-width: ${viewportV2.desktop}) {
      height: 280px;
    }
  `,
  Tag: styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    padding: 5px 10px;
    background: ${props=>props.theme.black};
    border-radius: 16px;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.16);
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: ${props=>props.theme.white};
    font-family: ${fonts.nunito};
  `,

  Tags: styled.aside`
    position: relative;
    margin-bottom: 8px;
    margin-left: 16px;
    width: auto;
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    span {
      margin-right: 10px;
    }
  `,
  LoadArea: styled.div`
    width: 1000%;
  `
}

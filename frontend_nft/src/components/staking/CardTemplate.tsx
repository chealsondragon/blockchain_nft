import { Skeleton, Spin } from 'antd'
import React, { ReactNode, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import notFound from '../../assets/notfound.svg'
import { imgLH3, safeIpfsUrl } from '../../services/UtilService'
import { fonts, viewportV2 } from '../../styles/variables'

export type CardTemplateProps = {
  image?: string
  className?: string
  name?: string
  selectedItems? : string[]
  collectionName?: string
  isStaking?: boolean
  chainId: number
  loading?: boolean
  children?: ReactNode
  onClick?: (val?: string) => void
}

export function CardTemplate({
  image,
  name,
  selectedItems,
  collectionName,
  isStaking,
  loading,
  className,
  chainId,
  children,
  onClick
}: CardTemplateProps) {
  const metadataImage = image
  const [selected, setSelected] = useState(false);
  const [selectedImage, setSelectedImage] = useState((metadataImage && safeIpfsUrl(metadataImage)) || notFound)

  const onImageError = () => {
    setSelectedImage(notFound)
  }

  useEffect(() => {
    if(isStaking)
      setSelected(false);
  }, [isStaking])

  const handleClick = () => {
    if(typeof onClick !== "undefined") onClick()
    if(isStaking)
      setSelected(false);
    else
      setSelected(!selected);
  }

  return (
    <S.Card onClick = {handleClick} className = {selected === true ? 'selected': 'deseleced'}>
        <Link to='#'>
        <S.ImageDiv>
          <Spin indicator={<Skeleton.Avatar active size={64} shape='circle' />} spinning={!!loading} />
          <S.Img
            src={imgLH3(selectedImage, 400)}
            className={selectedImage === notFound ? 'img-fail' : ''}
            onError={onImageError}
            alt={name || 'not found'}
            hidden={!!loading}
            loading='lazy'
          />
          {isStaking&&
            <S.Staked>Staked</S.Staked>
          }
        </S.ImageDiv>
        <S.Content>
          {collectionName&& 
            <S.Name>{name}</S.Name>          
          }
        </S.Content>
      </Link>
    </S.Card>
  )
}

export const S = {
  Card: styled.div`
    width: 100%;
    height: auto;
    max-width: 400px;
    border: 1px solid ${props=>props.theme.gray[1]};
    box-sizing: border-box;
    border-radius: 18px;
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

    .selected: {
      border: 2px solid #44b1ff !important
    }

    .deseleced : {
      border: none 
    }
  `,
  Staked: styled.span`
    position: absolute;
    margin-top: 270px;
    background: rgb(53, 167, 107);
    color: white;
    font-weight: 600;
    padding 5px 10px;
    border-radius: 5px;
    font-size: 20px;
    line-height: 30px;
    min-width: 250px;
    text-align: center;

    span {
      font-size: 13px;
    }
  `,
  Name: styled.div`
    color: ${props=>props.theme.gray['4']};
    font-size: 22px;
    font-weight: 400;
    margin-top: 5px;
  `,
  ImageDiv: styled.div`
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
  Content: styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    border-top-right-radius: 16px;
    border-top-left-radius: 16px;
    min-height: 50px;
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
  Tag: styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    height: 32px;
    background: ${props=>props.theme.white};
    padding: 10px;
    border-radius: 16px;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.16);
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: ${props=>props.theme.black};
    font-family: ${fonts.nunito};
  `,

  Tags: styled.aside`
    position: absolute;
    margin-top: -48px;
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

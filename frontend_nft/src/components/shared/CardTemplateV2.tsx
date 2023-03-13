import { Skeleton, Spin } from 'antd'
import React, { ReactNode, useState } from 'react'
import { RiArrowGoBackFill } from 'react-icons/ri'
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

export function CardTemplateV2({
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
          <S.Mask></S.Mask>
          <div style={{top: "0px", left: '0px', width: '100%', height: '100%', position:'absolute', zIndex: 4}}>
          <S.Img
            src={imgLH3(selectedImage, 400)}
            className={selectedImage === notFound ? 'img-fail' : ''}
            onError={onImageError}
            alt={name || 'not found'}
            hidden={!!loading}
            loading='lazy'
          />
          </div>
          <S.Collection>
            <S.LogBack>
              <S.Logo>
              </S.Logo>
            </S.LogBack>
            <S.Name>name</S.Name>
          </S.Collection>
          <S.Detail className="zview6">
            <div className="zview6 flex column_direction">
              <h2 className="block zview6 name color_alpha">{name}</h2>
            </div>
            <div className="zview6 block">
              <div className="zview6 flex column_direction color_white stretch_align">
                <div className="zview6 flex space line_height1">
                  <div className="zview6 flex center_align">
                    <div className="zview6 block line_height1">
                      <svg className="block zview6 svg relative_position" width={17} height={17} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_1671_7070)">
                          <path d="M7.93016 2.25C7.71811 3.4866 7.20922 4.6533 6.44716 5.65C5.56316 6.805 3.36816 7.95 3.36816 10.782C3.36844 11.6913 3.61035 12.5842 4.06913 13.3693C4.52791 14.1544 5.18709 14.8034 5.97916 15.25C6.0078 14.8457 6.12438 14.4524 6.32077 14.0978C6.51716 13.7432 6.78861 13.4358 7.11616 13.197C7.74657 12.7822 8.23071 12.1799 8.50016 11.475C9.18168 11.8688 9.76351 12.4141 10.2006 13.0687C10.6378 13.7233 10.9185 14.4696 11.0212 15.25C11.8132 14.8034 12.4724 14.1544 12.9312 13.3693C13.39 12.5842 13.6319 11.6913 13.6322 10.782C13.6322 9.35 13.3762 5.438 7.93016 2.25Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_1671_7070">
                            <rect width="16" height="16" fill="white" transform="translate(0.5 0.75)"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className="block zview6 color_white font_style1">Minted out</div>
                  </div>
                  <div className="block zview6 line_height1 color_white">110/110</div>
                </div>
                <div className="zview6 block color_white progress relative_position" style={{marginTop: "15px", borderRadius: "5px"}}>
                  <div className="zview6 block color_white" style={{backgroundColor: "white", boxSizing: "content-box", transform: "translateX(0%)", borderRadius: '5px'}}></div>
                </div>
              </div>
            </div>
            <div className="zview6 flex center_align space relative_position">
              <div className="zview6 block" style={{minWidth: "0px"}}>
                <div className="zview6 block">
                  <div className="zview6 owner">
                    <div className="zview6 block flex center_align icon_pan">
                      <div className="zview6 block owner_icon"></div>
                      <span className="zview6">@sisab</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </S.Detail>
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

    a {
      text-decoration: none;
    }
  `,
  Content: styled.div`
    display: flex;
    flex-direction: column;
    padding: 24px;
    border-top-right-radius: 16px;
    border-top-left-radius: 16px;
    min-height: 350px;
    position: relative;
    z-index: 3;
    @media (min-width: ${viewportV2.tablet}) {
      min-height: 400px;
    }
    @media (min-width: 1600px) {
      min-height: 490px;
    }
    .zview6 { 
      z-index: 6;
    }
  `,
  Img: styled.img`
    width: 100%;
    display: block;
    object-fit: cover;
    height: 100%;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    -webkit-user-drag: none;
    z-index: 4;
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
  `,
  Mask: styled.div`
    position: absolute;
    z-index: 5;
    top: 0px;
    left: 0px;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
    border-radius: 16px;
  `,
  Collection: styled.div`
    width: 100%;
    gap: 12px;
    display: flex;
    position: relative;
    align-items: flex-start;
    justify-content: space-between;
  `,
  LogBack: styled.div`
    padding: 9px;
    border-radius: 27px;
    background-color: rgba(255,255,255, 0.2);
    backdrop-filter: blur(10px);
    z-index: 6;
  `,
  Logo: styled.div`
    background-image: url("assets/gallery/1.jpg");
    border-radius: 18px;
    width: 96px;
    height: 96px;
    background-size: cover;
    background-position: center center;
    z-index: 6;
  `,
  Name: styled.div`
    margin-left: auto;
    color: white;
    background: rgba(255,255,255,0.2);
    font-size: 16px;
    padding: 6px 16px;
    line-height: 1.25;
    font-weight: 500;
    border-radius: 9999px;
    z-index: 6;
    text-transform: uppercase;
  `,
  Detail: styled.div`
    display: flex;
    flex-direction: column;
    margin-top: auto;
    box-sizing: content-box;
    .name {
      font-size: 28px;
      font-weight: 400px;
      line-height: 40px;
      letter-spacing: -0.64px;
      font-family: "LULO";
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
      padding: 0px 12px 0px 6px;
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
      margin-right: 4px;
      width: 24px;
      border-radius: 10px;
    }
    .icon_pan {
      max-width: 100%;
    }
    .stretch_align {
      align-items: stretch;
    }
    .center_align {
      align-items: center;
    }
    .column_direction {
      flex-direction: column;
    }
    .mint_descpan {
      height: 18px;
      line-height: 18px;
    }
    .line_height1 {
      line-height: 18px;
    }
    .font_weight1{
      font-weight: 600;
    }
    .color_alpha {
      color: rgba(255,255,255,0.5);
    }
    .color_white {
      color: white;
    }
    .svg {
      color: white;
      fill: none;
      height: 16px;
      line-height: 18px;
      overflow-x: hidden;
      overflow-y: hidden;
      width: 16px;
      margin-right: 5px;
    }
    .progress {
      backdrop-filter: blur(10px);
      background-color: rgba(255,255,255,0.3);
      height: 8px;
      overflow-x: hidden;
      overflow-y: hidden;
      box-sizing: content-box;
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
  `
}

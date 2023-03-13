import { useReactiveVar } from '@apollo/client/react'
import {useSearchParams} from 'react-router-dom';
import { Alert, Button, Checkbox, Image, ImageProps, Input, Radio } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { RcFile } from 'antd/es/upload'
import Dragger from 'antd/es/upload/Dragger'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import mintImageTypeDefault from '../assets/mintImageTypeDefault.png'
import { getChainConfigById } from '../config'
import { clearTransaction, transactionLoadingVar, transactionVar } from '../graphql/variables/TransactionVariable'
import { accountVar, chainIdVar } from '../graphql/variables/WalletVariable'
import { code } from '../messages'
import { PinataIpfsNFTService } from '../services/IpfsService'
import { mintErc721 } from '../services/MintService'
import { getCollectionInfo } from '../services/CollectionService'
import { notifyError, notifySuccess } from '../services/NotificationService'
import { colors, colorsV2, fonts, viewport, viewportV2 } from '../styles/variables'
import { Erc3525Attribute, Erc3525Metadata } from '../types/nftType'
import { Erc3525SlotType, Erc3525Collection } from '../types/nftType';
import { DefaultPageTemplate } from './template/DefaultPageTemplate'

export default function MintPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [author, setAuthor] = useState<string>()
  const [socialMedia, setSocialMedia] = useState<string>()
  const [isLazyMinting, setIsLazyMinting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nftImageUrl, setNftImageUrl] = useState<string | undefined>(undefined)
  const [nftImage, setNftImage] = useState<File | undefined>(undefined)
  const [isVisible, setIsVisible] = useState(false)
  const [supply, setSupply] = useState<number>(1)
  const transaction = useReactiveVar(transactionVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)
  
  const [searchParams] = useSearchParams();
  const routeNftType:string | null  = searchParams.get('nfttype');
  const collectionId:string | null = searchParams.get('collectionId');
  const collectionAddress:string | null = searchParams.get('collectionAddress');

  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false)
  const [erc3525Properties, setErc3525Properties] = useState<Erc3525Attribute[]>([{ trait_type: '', value: '' }])
  const [alt, setAlt] = useState<string>('')
  const [erc3525Slots, setErc3525Slots] = useState<Erc3525SlotType[]>([{ property: '', values: ['']}]);
  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(0);
  const [slotValue, setSlotValue] = useState(0);
  const [slotValuesArr, setSlotValuesArr] = useState<number[]>([]);

  const chainId = useReactiveVar(chainIdVar)
  const account = useReactiveVar(accountVar)

  const { mint } = getChainConfigById(chainId)
  
  function setVisible() {
    setIsVisible(!isVisible)
  }

  useEffect(() => {
    const init_data = async () => {
      let data = {_id: collectionId};
      let result: Erc3525Collection = await getCollectionInfo(data, chainId);
      if(result){
        if(result['slottype'])
        {
          setErc3525Slots(result['slottype']);
          result['slottype'].map((slot, index) => {
            setSlotValuesArr([...slotValuesArr,0]);
          })
        }
      }
    }
    init_data();
  }, [])

  useEffect(() => {
    if (!transactionLoading && transaction && transaction.type === 'mint' && transaction.confirmed && !isLoading ) {
      notifySuccess('NFT minted successfully!')
      // history.push(`/wallet/fractionalize`)
      clearTransaction()
    }
  }, [transaction, transactionLoading])

  const mintNft = async () => {
    setIsLoading(true)

    const nftMetadataJson: Erc3525Metadata = {
      title: title || '',
      description: description || '',
      author: author || '',
      image: '',
      social_media: socialMedia || '',
      created_at: new Date().toJSON(),
      attributes: erc3525Properties,
      alt: alt || ''
    }

    const nftMetadata = nftImage && (await PinataIpfsNFTService().uploadNFTToIpfs(nftMetadataJson, nftImage))

    if (!nftMetadata || nftMetadata.error) {
      notifyError(nftMetadata && nftMetadata.error ? nftMetadata.error : code[5011])
      setIsLoading(false)
      return
    }
    let w_ret = account && nftMetadata.cid && await mintErc721(collectionAddress?collectionAddress:'', account, nftMetadata.cid, collectionId?collectionId:'', '',chainId)
    //account && nftMetadata.cid && mintErc721(nftMetadata.cid, collectionId, nftType, chainId)
    setIsLoading(false)
  }

  const handleImageUpload = (file: RcFile) => {
    setNftImageUrl(undefined)

    const isBiggerThanLimitFilesize = file.size / 1024 / 1024 > 75

    if (isBiggerThanLimitFilesize) {
      notifyError(`The media file must be equal or smaller than 75MB`)
      return false
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setNftImageUrl((reader.result as string) || '')
    }
    setNftImage(file)
    return false
  }

  const handleImageRemoval = () => {
    setNftImageUrl(undefined)
    return true
  }

  const isReadyToMint = (): boolean => {
    let mediaUpload = nftImage

    return !!(mediaUpload && title && author) //&& !!account
  }

  const handlePropertyChange = (index: number, value: string, type: 'name' | 'value') => {
    const values = [...erc3525Properties]
    if (type === 'name') {
      values[index].trait_type = value
    } else {
      values[index].value = value
    }

    setErc3525Properties(values)
  }

  const handlePropertyAction = (index: number) => {
    if (index + 1 === erc3525Properties.length) {
      setErc3525Properties([...erc3525Properties, { trait_type: '', value: '' }])
      return
    }

    setErc3525Properties(erc3525Properties.filter((property, propertyIndex) => propertyIndex !== index))
  }

  const onSelectValue = (index: number) => {
    const values = [...slotValuesArr];
    values[selectedPropertyIndex] = index;
    setSlotValuesArr(values);
  }

  return (
    <DefaultPageTemplate>
      <S.Container>
        <header>
          <span>Mint your NFT</span>
          <small>(ERC3525)</small>
        </header>
        <div>
          <S.ItemCreation>
            <div>
              <h3>Category</h3>
              <h2>{routeNftType}</h2>
            </div>
            <S.MediaUploadWrapper>
              <div>
                <h3>Upload</h3>
                <h4>Image</h4>
                <Dragger
                  id='fileUpload'
                  maxCount={1}
                  name='file'
                  onRemove={handleImageRemoval}
                  beforeUpload={handleImageUpload}
                  accept='image/png,image/jpeg,image/gif,image/tiff'>
                  <p className='ant-upload-drag-icon'>
                    <S.Button>Choose File</S.Button>
                  </p>
                  <p className='ant-upload-hint'>
                    {`Supports GIF, JPG, PNG and TIFF. Max file size: 75MB.`}
                  </p>
                </Dragger>
              </div>
            </S.MediaUploadWrapper>
            <div>
              <h3>Title</h3>
              <S.Input maxLength={60} value={title} onChange={event => setTitle(event.target.value)} />
            </div>
            <div>
              <h3>Author</h3>
              <S.Input maxLength={60} value={author} onChange={event => setAuthor(event.target.value)} />
            </div>
            <div>
              <h3>Social Media URL</h3>
              <S.Input maxLength={255} value={socialMedia} onChange={event => setSocialMedia(event.target.value)} />
            </div>
            <div>
              <h3>Description</h3>
              <S.TextArea maxLength={1000} showCount rows={4} value={description} onChange={event => setDescription(event.target.value)} />
            </div>
            <div>
              <h3>Fraction Amount</h3>
              {routeNftType === 'Merchandize'?
                <S.Input type='number' maxLength={50} value={supply} onChange={event => setSupply(parseInt(event.target.value))} />
                :
                <S.Input type='number' maxLength={50} value={supply} />
              }
            </div>
            {routeNftType === 'Merchandize' && (
              <div>
                <h3>Slots</h3>
                <div style={{display:'grid', gridTemplateColumns: '2fr 2fr'}}>
                {erc3525Slots &&
                  erc3525Slots.map((erc3525Slot, index) => (
                    index !== selectedPropertyIndex?
                      <S.Button className='property' key={'prop'+index} onClick={() => setSelectedPropertyIndex(index)}>
                        {`${erc3525Slot.property}`}
                      </S.Button>
                    :
                      <S.Button className='property-selected' key={'prop'+index} onClick={() => setSelectedPropertyIndex(index)}>
                        {`${erc3525Slot.property}`}
                      </S.Button>
                  ))}
                  <div style={{paddingLeft:'20px'}}>
                  {erc3525Slots &&
                    erc3525Slots[selectedPropertyIndex].values.map((erc3525SlotValue, index) => (
                      index !== slotValue?
                        <S.Button className='values' key={'val'+index} style={{}} onClick={() => onSelectValue(index)}>
                          {`${erc3525SlotValue}`}
                        </S.Button>
                      :
                        <S.Button className='values-selected' key={'val'+index} style={{}} onClick={() => onSelectValue(index)}>
                          {`${erc3525SlotValue}`}
                        </S.Button>
                  ))}
                  </div>
                  </div>
                  <S.MediaUploadWrapper>
                    <div>
                      <h3>Upload</h3>
                      <h4>Slot Image</h4>
                      <Dragger
                        id='fileUpload'
                        maxCount={1}
                        name='file'
                        onRemove={handleImageRemoval}
                        beforeUpload={handleImageUpload}
                        accept='image/png,image/jpeg,image/gif,image/tiff'>
                        <p className='ant-upload-drag-icon'>
                          <S.Button>Choose File</S.Button>
                        </p>
                        <p className='ant-upload-hint'>
                          {`Supports GIF, JPG, PNG and TIFF. Max file size: 75MB.`}
                        </p>
                      </Dragger>
                    </div>
                  </S.MediaUploadWrapper>
              </div>
              
            )}
            <div>
              <S.Button className='advanced-settings' onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>
                {`${showAdvancedSettings ? 'Hide' : 'Show'} advanced settings`}
              </S.Button>
            </div>
            {showAdvancedSettings && (
              <div>
                <h3>Attributes (optional)</h3>
                {erc3525Properties &&
                  erc3525Properties.map((erc3525Property, index) => (
                    <S.PropertyItem className='nft-property' key={`item-${index + 1}`}>
                      <S.Input
                        name='name'
                        onChange={event => handlePropertyChange(index, event.target.value, 'name')}
                        placeholder='E.g. Size'
                        value={erc3525Property.trait_type}
                      />
                      <S.Input
                        name='value'
                        onChange={event => handlePropertyChange(index, event.target.value, 'value')}
                        placeholder='E.g. M'
                        value={erc3525Property.value}
                      />
                      <S.Button onClick={() => handlePropertyAction(index)}>
                        {`${index + 1 === erc3525Properties.length ? '+' : '-'}`}
                      </S.Button>
                    </S.PropertyItem>
                  ))}
              </div>
            )}
            {showAdvancedSettings && (
              <div>
                <h3>Alternative text for NFT (optional)</h3>
                <S.Input
                  value={alt}
                  onChange={event => setAlt(event.target.value)}
                  placeholder='Image description in details (do not start with word “image”)'
                />
              </div>
            )}
            <S.AcceptTerms>
              <span>
                <S.Checkbox checked={isLazyMinting} onChange={event => setIsLazyMinting(event.target.checked)} />
                <span> Lazy Minting</span>
              </span>
            </S.AcceptTerms>
            <div>
              <p className='less-attractive'>
                Once your NFT is minted on the blockchain, you will not be able to edit or update any of its information.
              </p>
              <br />
              <p className='less-attractive'>
                You agree that any information uploaded to the Blockchain NFT Minter will not contain material subject to copyright or other
                proprietary rights, unless you have necessary permission or are otherwise legally entitled to post the material.
              </p>
            </div>
            <div>
              <S.Button loading={isLoading} disabled={!isReadyToMint()} onClick={mintNft}>
                Create item
              </S.Button>
            </div>
          </S.ItemCreation>
          <S.Preview>
            <h3>Preview</h3>
            <div>
              <div>
                <S.Card>
                  <div>
                    <S.ImageWrapper>
                      <S.Image src={nftImageUrl || mintImageTypeDefault} onPreviewClose={setVisible} loading='lazy' />
                      {isVisible && <div className='title-image-nft'>{title || ''}</div>}
                    </S.ImageWrapper>
                  </div>
                  <div>
                    <span>NFT</span>
                    <span className='preview-title'>{title}</span>
                  </div>
                </S.Card>
              </div>
              <div>
                <h4>Author</h4>
                <p>{author}</p>
                <h4>Social Media</h4>
                <p>{socialMedia}</p>
                <h4>Description</h4>
                <p>{description}</p>
              </div>
              {routeNftType === 'Merchandize' && (
              <div>
                <h4 style={{marginBottom: '0px'}}>Slot</h4>
                <S.Card style={{paddingTop: '0px'}} >
                  <div>
                    <S.ImageWrapper>
                      <S.Image src={nftImageUrl || mintImageTypeDefault} onPreviewClose={setVisible} loading='lazy' />
                      {isVisible && <div className='title-image-nft'>{title || ''}</div>}
                    </S.ImageWrapper>
                  </div>
                  <div>
                    <span>slot</span>
                    {erc3525Slots &&
                      erc3525Slots.map((erc3525Slot, index) => (
                        <span className='preview-title'>{`${erc3525Slot.property} - ${erc3525Slot.values[slotValuesArr[index]]}`}</span>
                      ))
                    }
                  </div>
                </S.Card>
              </div>
              )}
            </div>
          </S.Preview>
        </div>
      </S.Container>
    </DefaultPageTemplate>
  )
}

const S = {
  Container: styled.div`
    width: 100%;
    max-width: ${viewportV2.desktopXl};
    margin: 0 auto;

    > div {
      display: flex;
      margin-top: 24px;
      justify-content: center;

      @media (max-width: ${viewport.sm}) {
        flex-direction: column;
        &:first-child {
          margin-bottom: 24px;
        }
      }
    }

    header {
      display: flex;
      margin-top: 24px;
      justify-content: center;
      align-items: center;
      margin-bottom: 48px;
      span {
        color: ${colors.gray12};
        font-weight: 600;
        font-size: 38px;
        @media (max-width: ${viewport.sm}) {
          margin: 0;
          font-size: 20px;
        }
      }

      small {
        font-size: 16px;
        font-weight: bold;
        color: ${colors.gray12};
        margin-left: 8px;

        @media (max-width: ${viewport.sm}) {
          font-size: 12px;
          margin: 0;
        }
      }
    }

    h3 {
      font-weight: 400;
      font-size: 16px;
      margin-bottom: 8px;
      color: ${(props)=>props.theme.gray['4']};
    }

    h4 {
      font-weight: 400;
      font-size: 14px;
      color: ${(props)=>props.theme.gray['4']};
    }

    p,
    span {
      font-weight: 400;
      font-size: 16px;
      color: ${(props)=>props.theme.gray['4']};
      &.less-attractive {
        color: #888;
      }
    }

    .ant-upload-hint {
      font-weight: 400;
    }
  `,
  AcceptTerms: styled.div`
    > p {
      margin-top: 8px;
    }
  `,
  Preview: styled.div`
    max-width: 312px;

    @media (max-width: ${viewport.sm}) {
      max-width: none;
    }

    > div {
      display: flex;
      flex-direction: column;

      > div {
        &:first-child {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: auto;
          margin-bottom: 16px;

          > div {
            margin-left: 0;
            height: 370px;

            @media (max-width: ${viewport.sm}) {
              width: 100%;
            }
          }
        }

        &:last-child {
          p {
            font-weight: 400;
            font-size: 12px;
            min-height: 20px;
            margin-bottom: 8px;
            word-break: break-all;
            white-space: break-spaces;
            color: ${(props)=>props.theme.gray['4']};
          }
        }
      }
    }
  `,
  Checkbox: styled(Checkbox)`
    .ant-checkbox-inner {
      border-radius: 50%;
    }
  `,
  Button: styled(Button)`
    border-radius: 8px;
    background-color: ${colors.blue1};
    color: ${colors.white};
    border: none;
    box-shadow: none;
    width: 100%;
    height: 40px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${colors.blue1};
      color: ${colors.white};
      opacity: 0.8;
      box-shadow: none;
      border: none;
    }

    &:disabled {
      &:hover,
      &:active,
      &:focus {
        background-color: ${colors.blue1};
        color: ${colors.white};
        opacity: 0.6;
        box-shadow: none;
        border: none;
      }

      background-color: ${colors.blue1};
      color: ${colors.white};
      opacity: 0.6;
      box-shadow: none;
      border: none;
    }

    &.advanced-settings {
      background-color: ${colors.gray11};

      &:hover,
      &:active,
      &:focus {
        background-color: ${colors.gray11};
      }

      &:disabled {
        &:hover,
        &:active,
        &:focus {
          background-color: ${colors.gray11};
          opacity: 0.6;
          box-shadow: none;
          border: none;
        }
      }
    }

    &.values {
      background-color: black;
      width: 100%;
      margin-bottom: 15px;
    }

    &.values-selected {
      background-color: ${colors.gray11};
      width: 100%;
      margin-bottom: 15px;
    }

    &.property {
      margin-bottom: 15px;
    }

    &.property-selected {
      margin-bottom: 15px;
      background-color: #10b1b1;
    }

    span {
      color: white;
    }
  `,
  Input: styled(Input)`
    border-radius: 8px;
    border: none;
    box-shadow: 1px 1px 5px hsl(0deg 0% 0% / 5%);
    color: ${(props)=>props.theme.gray['4']};
    background: ${(props)=>props.theme.gray['0']};
    border: 1px solid ${(props)=>props.theme.gray['2']};
  `,
  TextArea: styled(TextArea)`
    border-radius: 8px;
    border: none;
    box-shadow: 1px 1px 5px hsl(0deg 0% 0% / 5%);
    .ant-input {
      color: ${(props)=>props.theme.gray['4']};
      background: ${(props)=>props.theme.gray['0']};
      border: 1px solid ${(props)=>props.theme.gray['2']};
    }
  `,
  NftTypeWrapper: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    @media (min-width: 400px) {
      gap: 24px;
    }
    @media (min-width: ${props => props.theme.viewport.desktop}) {
      gap: 50px;
    }
    > button {
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      background: ${colors.gray13};
      box-sizing: border-box;
      border-radius: 8px;
      width: 112px;
      height: 112px;
      transition-property: opacity;
      transition-timing-function: ease-in;
      transition-duration: 250ms;

      > span {
        font-size: 14px;
        line-height: 16px;
        font-weight: 400;
      }

      &.active {
        border: 1px solid ${colorsV2.blue.lighter};
      }

      &:hover {
        opacity: 0.65;
      }
    }
  `,
  MediaUploadWrapper: styled.div`
    margin-top: 40px !important;
    display: flex;
    justify-content: flex-start;

    .ant-btn {
      margin-top: 8px;
      width: 80%;
    }

    min-height: 166px;
    @media (max-width: ${viewport.sm}) {
      min-height: 188px;
    }

    > div {
      height: 100%;
      width: 100%;

      > h4 {
        margin-bottom: 8px;
      }

      &:only-child {
        max-width: 528px;
        @media (max-width: ${viewport.sm}) {
          max-width: none;
        }
      }

      &:not(:only-child) {
        max-width: 256px;
        @media (max-width: ${viewport.sm}) {
          max-width: none;
        }
      }

      &:not(:first-child) {
        margin-left: 16px;
        margin-top: 28px;
        @media (max-width: ${viewport.sm}) {
          margin-top: 16px;
          margin-left: auto;
        }
      }
    }

    @media (max-width: ${viewport.sm}) {
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }
  `,
  Alert: styled(Alert)`
    border-radius: 8px;
    font-weight: 400;

    .ant-alert-message {
      margin-bottom: 8px;
      font-size: 14px;
    }
  `,
  ItemCreation: styled.div`
    max-width: 528px;
    margin-right: 40px;

    @media (max-width: ${viewport.sm}) {
      margin-right: 0;
      margin-bottom: 24px;
    }

    > div {
      margin-top: 24px;
    }

    div:nth-child(1) {
      margin-top: 0px;
    }

    > button {
      text-transform: uppercase;
      margin-top: 32px;
      width: 100%;
    }
  `,
  PropertyItem: styled.div`
    display: grid;
    grid-template-columns: 4fr 4fr 1fr;
    gap: 16px;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    > input {
      border-radius: 8px;
      height: 40px;
    }

    > button {
      border: none;
      box-shadow: none;
      height: 40px;
      border-radius: 8px;
      background-color: ${colors.gray11};
      color: ${colors.white};
      > span {
        font-size: 24px;
        line-height: 24px;
      }

      &:hover,
      &:active,
      &:focus {
        border: none;
        box-shadow: none;
        background-color: ${colors.gray11};
        color: ${colors.white};
        opacity: 0.6;
      }
    }
  `,
  Card: styled.div`
    width: 304px;
    padding: 16px;
    height: 370px;
    border: 1px solid transparent;
    box-sizing: border-box;
    border-radius: 8px;
    justify-content: center;
    box-shadow: 1px 1px 5px hsla(0, 0%, 0%, 0.05);
    background: ${colorsV2.white};

    &:hover {
      cursor: pointer;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow ease-in 250ms;
    }

    @media (max-width: ${viewport.md}) {
      margin: 0 auto;
    }

    > div {
      &:first-child {
        width: 100%;
        height: 270px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 8px;
        margin-bottom: 8px;
      }

      &:last-child {
        border-top: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        > span {
          color: ${colorsV2.gray['4']};
          font-size: 10px;
          font-weight: 400;
          line-height: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 13px;
          margin-top: 8px;

          &:last-child {
            color: ${colorsV2.gray['4']};
            margin-top: 4px;
            font-size: 14px;
            height: 18px;
            font-weight: 500;
            line-height: 18px;
          }
        }
      }
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

    .ant-skeleton {
      height: 270px;
      display: flex;
      align-items: center;
    }
  `,
  ImageWrapper: styled.div`
    display: flex;
    justify-content: center;
    width: auto;
    height: auto;
    .title-image-nft {
      position: fixed;
      bottom: 20px;
      left: 20px;
      color: black;
      font-weight: 400;
      font-size: 1.5rem;
      z-index: 999999;
      font-family: ${fonts.nunito};
    }

    > .ant-image {
      width: 100%;
      height: 100%;
    }

    .ant-image-mask-info {
      text-align: center;
      @media (max-width: ${viewport.md}) {
        display: none;
      }
    }

    .ant-image-mask-info {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      font-size: 1.6rem;
      font-family: ${fonts.nunito};
      font-style: normal;
      font-weight: 400;
    }
  `,
  Image: styled(Image)<ImageProps>`
    border-radius: 8px;
    object-fit: cover;
    height: auto;
    max-height: 279px;
  `,
  Media: styled.img `
    width: 90px;
    height: 90px;
    margin-top: 35px;
    margin-bottom: 20px;
  `
}

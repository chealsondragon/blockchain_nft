import { useReactiveVar } from '@apollo/client/react'
import { Button, Input, Radio, Row, Col } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '../styles/variables'
import * as IoIcons from 'react-icons/io';
import { notifyWarning, notifySuccess } from '../services/NotificationService'
import {AddCollection} from '../services/CollectionService';
import { validate } from '../services/ValidationService';
import { DefaultPageTemplate } from './template/DefaultPageTemplate'
import { getChainConfigById } from '../config'
import { clearTransaction, transactionLoadingVar, transactionVar } from '../graphql/variables/TransactionVariable'
import { accountVar, chainIdVar } from '../graphql/variables/WalletVariable'
import { getCollectionInfo, UpdateCollection } from '../services/CollectionService'
import { Erc3525SlotType, Erc3525Collection } from '../types/nftType';
import { imageUpload } from '../services/CollectionService';
import { API } from '../constants/api'
export default function CreateCollectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode: any = searchParams.get("mode");
  const collectionId: any = searchParams.get('collectionId');
  const chainId = useReactiveVar(chainIdVar)
  const account = useReactiveVar(accountVar)
  const [description, setDescription] = useState<string>()
  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [showImage, setShowImage] = useState<boolean>(true);
  const [heightImage, setHeightImage] = useState<string>('auto');
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [erc3525Slots, setErc3525Slots] = useState<Erc3525SlotType[]>([{ property: '', values: ['']}]);
  const [category, setCategory] = useState(1);
  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(0);

  useEffect(() => {
    if(mode == 'update') init_data();
  }, [mode])

  const init_data = async () => {
    let data = {_id: collectionId};
    let result: Erc3525Collection = await getCollectionInfo(data, chainId);
    if(result){
      setName(result['name']);
      setSymbol(result['symbol']?result['symbol']:'');
      setDescription(result['description'])
      setImage(result['image'])
      setShowImage(false);
      setHeightImage('100%');
      setCategory(result['category']);
      if(result['slottype'])
        setErc3525Slots(result['slottype'])
    }
  }

  const transaction = useReactiveVar(transactionVar)
  const transactionLoading = useReactiveVar(transactionLoadingVar)

  const { mint } = getChainConfigById(chainId)
  
  useEffect(() => {
    if (!transactionLoading && transaction && transaction.type === 'createCollection' && transaction.confirmed && !isLoading) {
      notifySuccess('Collection created successfully! You will be redirected to the myCollection page in a few seconds')
      navigate(`/collection/mycollection`)
      clearTransaction()
    }
  }, [transaction, transactionLoading, isLoading])

  const onFileChange = async (e:any, field:string) => {    
    let isImage = true;
    const timestamp = Date.now();
    let image = e.target.files;
    let formData = new FormData();
    let filename = Math.random().toString() + timestamp + '.jpg';
    for (const key of Object.keys(image)) {
      if ( /\.(jpe?g|png|gif|bmp)$/i.test(image[key].name) === false ) { isImage = false; break; }
      formData.append('file', image[key], filename)
    }
    if(!isImage){
      notifyWarning('Not image format')
      return;
    }
    const isUploaded = await imageUpload(formData);
    if(isUploaded){
      setImage(filename);
      setShowImage(false);
      setHeightImage('100%');
      console.log(filename)
    }
  }

  const onReturnClick = (e:any) => {
    setImage('');
    setShowImage(true);
    setHeightImage('auto');
  }

  const submit = async () => {
    setIsLoading(true)
    if(!validate('Collection name', name)) return;
    if(!validate('Collection image', image)) return;

    if(mode=='create'){
      const data:Erc3525Collection = {_id: '', name: name, symbol: symbol, decimals: 18, description: description, image: image, slottype: erc3525Slots, category: category};
      account && AddCollection(mint.minterAddress, data, account, chainId)
    } else {
      let data:Erc3525Collection = {_id: collectionId, name: name, symbol: name, decimals: 18, description: description, image: image, slottype: erc3525Slots, category: category};
      const w_result = await UpdateCollection(data);
    }
    
    setIsLoading(false)
  }

  const handlePropertyAction = (index: number, type: 'property' | 'value') => {
    if(type === 'property')
    {
      if (index + 1 === erc3525Slots.length) {
        setErc3525Slots([...erc3525Slots, { property: '', values: ['']}]);
        return;
      }
      setErc3525Slots(erc3525Slots.filter((slot, slotIndex) => slotIndex !== index));
    } else if(type === 'value') {
      if (index + 1 === erc3525Slots[selectedPropertyIndex].values.length) {
        const slots = [...erc3525Slots];
        slots[selectedPropertyIndex].values.push('');
        setErc3525Slots(slots);
        return;
      }
      const slots = [...erc3525Slots];

      slots[selectedPropertyIndex].values = slots[selectedPropertyIndex].values.filter((value, valueIndex) => valueIndex !== index);
      setErc3525Slots(slots);
    }
  }

  const handleSlotChange = (index: number, value: string, type: 'property' | 'value') => {
    const slots = [...erc3525Slots];

    if (type === 'property') {
      slots[index].property = value
    } else if(type === 'value') {
      slots[selectedPropertyIndex].values[index] = value;
    }

    setErc3525Slots(slots);
  }

  const handlePropertySel = (index: number) => {
    setSelectedPropertyIndex(index);
  }

  return (
    <DefaultPageTemplate noMargin fullWidth>
      <S.Content>
        <div>                
          <header>
            Add Your Collection
          </header>
          <S.subContent>
            <S.Span>Name</S.Span>
            <S.Input maxLength={10} value={name} placeholder="Enter Collection Name" onChange={(e: any) => setName(e.target.value)} readOnly = {mode === 'update'} />    
            <S.Span>Symbol</S.Span>
            <S.Input maxLength={10} value={symbol} placeholder="Enter Collection Symbol" onChange={(e: any) => setSymbol(e.target.value)} />                               
            <S.Span>Description</S.Span>
            <S.TextArea maxLength={1000} showCount rows={2} id='Descript' placeholder="Enter Description" value={description} onChange={(event:any) => setDescription(event.target.value)} />
            <S.Span>Collection Image</S.Span>
            <S.Help>This image will also be used for navigation. 350 x 350 recommended.</S.Help> 
            <S.ImageArea>
              <img src={image === ''?'' : API.server_url + API.collection_image + image} alt='' style={{width: '100%', objectFit: 'fill', height: heightImage }}/>
              { showImage? <IoIcons.IoMdImages id='logo_icon' style={{width: '50px', height: '50px'}} /> : null }
              { showImage? <span>No Logo Selected</span> : null }  
              { showImage? <S.Button id='logo_img'>
                <IoIcons.IoMdImage style={{width: '20px', height: '20px', marginBottom: '-5px', marginRight: '5px'}} />
                Select Image
                <S.ImageInput id='logo_input' type='file' name='logo' onChange={(e:any) => onFileChange(e, 'logo_img')}/>
              </S.Button> : null }
              { !showImage? <button className='returnbtn' onClick={(e:any)=>onReturnClick(e)}>REMOVE</button> : null }                
            </S.ImageArea> 
            <S.Span>Category</S.Span>
            <S.Row >
              <Radio value={1} onChange={()=>setCategory(1)} checked={1===category}>Art</Radio>
              <Radio value={2} onChange={()=>setCategory(2)} checked={2===category}>Merchandize</Radio>
              <Radio value={3} onChange={()=>setCategory(3)} checked={3===category}>Membership</Radio>
              <Radio value={4} onChange={()=>setCategory(4)} checked={4===category}>Utility</Radio>
            </S.Row>
            {category === 2 && (
              <S.Row>
                <S.Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <h4>Properties</h4>
                {erc3525Slots &&
                  erc3525Slots.map((erc3525Slot, index) => (
                    <S.PropertyItem className='nft-property' key={`item-${index + 1}`}>
                      <S.Input
                        name='property'
                        onChange={event => handleSlotChange(index, event.target.value, 'property')}
                        onFocus={event => handlePropertySel(index)}
                        placeholder='E.g. Size'
                        value={erc3525Slot.property}
                      />
                      <S.Button onClick={() => handlePropertyAction(index, 'property')}>
                        {`${index + 1 === erc3525Slots.length ? '+' : '-'}`}
                      </S.Button>
                    </S.PropertyItem>
                  ))}
                </S.Col>
                <S.Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <h4>{erc3525Slots[selectedPropertyIndex].property} - Values</h4>
                {erc3525Slots &&
                  erc3525Slots[selectedPropertyIndex].values.map((erc3525SlotValue, index) => (
                    <S.PropertyItem className='nft-property' key={`value-${index}`}>
                      <S.Input
                        name='value'
                        onChange={event => handleSlotChange(index, event.target.value, 'value')}
                        placeholder='E.g. Size'
                        value={erc3525SlotValue}
                      />
                      <S.Button onClick={() => handlePropertyAction(index, 'value')}>
                        {`${index + 1 === erc3525Slots[selectedPropertyIndex].values.length ? '+' : '-'}`}
                      </S.Button>
                    </S.PropertyItem>
                  ))}
                </S.Col>
            </S.Row>) }
            {/* :
            <S.Row>
              <h4>If you want to avoid transaction fee when NFT Item is minted, then you can use LazyMinting.
                Lazy minting is powerful function to allow you to pay transaction fee when NFT item would be sold.
              </h4>
              <Checkbox checked={lazyMinting} onClick={() => setLazyMinting(!lazyMinting)}>Lazy Minting</Checkbox>
              {lazyMinting && (<S.Input
                name='baseURI'
                onChange={event => setBaseURI(event.target.value)}
                placeholder='E.g. https://ipfs.io/ipfs/'
                value={baseURI}
              />)}
            </S.Row>
            } */}
            <S.Button style={{width:'100px', marginTop: '20px'}} id='login' loading={isLoading} onClick={ submit }>
              {mode=='create'? 'Create' : 'Update'}
            </S.Button>  
          </S.subContent>  
        </div>          
      </S.Content>
    </DefaultPageTemplate>
  )
}

const S = {
  Content: styled.div`
    display: flex;
    color: ${props=>props.theme.gray['4']};
    width: 100%;
    align-items: center;
    justify-content: center;
    div:nth-child(1) {
      border: 1px solid ${props=>props.theme.gray['1']};
      border-radius: 5px;
      line-height: 1.5rem;
      @media (min-width: ${props => props.theme.viewport.tablet}) {
        width: 80%;
        margin-top: 40px;
        margin-bottom: 40px;
      }

      @media (min-width: ${props => props.theme.viewport.desktopXl}) {
        width: 60%;
        margin-top: 100px;
        margin-bottom: 100px;
      }
      header {
        height: 40px;
        background: ${props=>props.theme.gray['0']};
        border-bottom: 1px solid ${props=>props.theme.gray['1']};
        padding: 7px 20px;
      }
    }
  `,
  subContent: styled.div`
    padding: 10px 20px 20px 20px;
  `,
  Span: styled.span`
    color: ${props => props.theme.black};
    font-family: ${props => props.theme.fonts.primary};
  `,    
  ImageInput: styled(Input)`
    opacity: 0;
    position: absolute;
    width: 150px;
    height: 30px;
    right:0px !important;
    appearance: none;
    cursor: default;
    align-items: baseline;
    color: inherit;
    text-overflow: ellipsis;
    white-space: pre;
    text-align: start !important;  
    background-color: ${props=>props.theme.gray['0']};
    margin: 0em;
    padding: 1px 2px;
    border-width: 2px;
    border-style: inset;
    border: none;
    border-image: initial;
  `,
  Button: styled(Button)`
    border-radius: 5px;
    background-color: rgb(34, 106, 237);
    color: ${colors.white};
    border: none;
    box-shadow: none;
    width: 150px;
    font-size: 16px;
    font-weight: bold;
    height: 40px;
    padding-bottom: 7px;

    &:hover,
    &:active,
    &:focus {
      background-color: rgb(34, 106, 237);
      color: ${colors.white};
      opacity: 0.8;
      box-shadow: none;
      border: none;
    }
  `,
  Input: styled(Input)`
    border-radius: 3px;
    box-shadow: 1px 1px 5px hsl(0deg 0% 0% / 30%);
    margin-top: 8px;
    margin-bottom: 15px;
    color: ${(props)=>props.theme.gray['4']};
    background: ${(props)=>props.theme.gray['0']};
    border: 1px solid ${props=>props.theme.gray['1']};
  `,
  TextArea: styled(TextArea)`
    border-radius: 8px;
    border: none;
    margin-bottom: 15px;
    box-shadow: 1px 1px 5px hsl(0deg 0% 0% / 5%);
    .ant-input {
      color: ${(props)=>props.theme.gray['4']};
      background: ${(props)=>props.theme.gray['0']};
      border: 1px solid ${props=>props.theme.gray['1']};
    }
  `,
  Help: styled.div`
    margin-top: 5px;
    font-size: 12px;
    color: #999;
  `,
  ImageArea: styled.div`
    border:1px solid ${props=>props.theme.gray['1']};
    text-align: center; 
    height: 200px; 
    position: relative; 
    display: flex; 
    justify-content: center; 
    flex: 1; 
    margin-bottom:20px;
    align-items: center; 
    flex-direction: column; 
    background-color: ${props=>props.theme.gray['0']};
    .returnbtn {
      position: absolute;
      top:0;
      right: 0;
      border-radius: 5px;
      background-color:  rgb(34, 106, 237);
      color: ${colors.white};
      border: none;
      box-shadow: none;
      width: 100px;
      font-size: 14px;
      font-weight: bold;
      height: 30px;
      padding-bottom: 7px;

      &:hover,
      &:active,
      &:focus {
        background-color: ${colors.red2};
        color: ${colors.white};
        opacity: 0.8;
        box-shadow: none;
        border: none;
      }
    }
  `,
  Row: styled(Row)`
    margin: 20px 0px 10px !important;
    h4 {
      margin: 0px;
      text-align: center;
    }
  `,
  Col: styled(Col)`
    margin: 0px 0px !important;
    border: 0px solid !important;
    padding: 0px 5px !important;
  `,
  PropertyItem: styled.div`
    display: grid;
    grid-template-columns: 2fr 2fr;
    gap: 16px;
    margin: 0px !important;
    border-width: 0px !important;
    width: 100% !important;
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
      background-color: ${colors.black};
      color: ${colors.white};
      margin-top: 8px;
      
      > span {
        font-size: 16px;
        line-height: 24px;
      }

      &:hover,
      &:active,
      &:focus {
        border: none;
        box-shadow: none;
        opacity: 0.6;
      }
    }
  `,
}

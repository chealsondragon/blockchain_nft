import { Button, Image, Input } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Header } from '../layout/Header'
import * as RiIcons from 'react-icons/ri';
import {useNavigate} from 'react-router-dom';
import {API} from '../../constants/api';
import { deleteCollection } from '../../services/CollectionService'
import defaultBannder from '../../assets/banner.jpg'

export type CollectionProps = {
  name: string,
  banner: string,
  item_count: number,
  collection_id?: string,
  collection_address?: string
  category: number
}

export default function CollectionMain({ name, banner, item_count, collection_id, collection_address, category }: CollectionProps) {
  const navigate = useNavigate();
  const [isMenu, setisMenu] = useState(false);
  const [isResponsiveclose, setResponsiveclose] = useState(false);
  const [isSubMenuCreate, setSubMenuCreate] = useState(false);
  let w_strCategory = '';
  if(category === 1) {
    w_strCategory = "Art";
  } else if(category === 2) {
    w_strCategory = "Merchandize";
  } else if(category === 3) {
    w_strCategory = "Membership";
  } else {
    w_strCategory = "Utility";
  }

  let createSubMenuClass = ["sub__menus"];
  if(isSubMenuCreate) {
      createSubMenuClass.push('sub__menus__Active');
  }else {
      createSubMenuClass.push('');
  }

  const sortHandle = async (e:any, mode:string, url:string, collectionId: string, collectionAddress: string) => {
    e.preventDefault();
    setisMenu(isMenu === false ? true : false);
    setResponsiveclose(isResponsiveclose === false ? true : false);
    if(mode === 'createItem') {
      navigate({
        pathname: url,
        search: `?nfttype=${w_strCategory}&collectionId=${collectionId}&collectionAddress=${collectionAddress}`
      });
    } else if(mode === 'updateCollection') {
      navigate({
        pathname: url,
        search: `?mode=update&collectionId=${collectionId}`
      });
    } else {
      let data = {collection_id: collection_id};
      let result = await deleteCollection(data);
      if(!result) return;
      navigate({
        pathname: url,
        search: `?mode=delete&collectionId=${collectionId}`
      });
    }
  };
  const createSubmenu = () => {
      setSubMenuCreate(isSubMenuCreate === false ? true : false);
  };

  return (
    <S.Container>
      <Header />
      <S.BannerImage>
        <img src={banner? API.server_url + API.collection_image + banner : defaultBannder} alt='' style={{width: '100%', objectFit: 'cover', height: 'auto', maxHeight: '250px'}} />
      </S.BannerImage>
      <div style={{float: 'right', marginTop: '-50px'}}>
        <S.SettingButton onClick={createSubmenu} className="sub__menus__arrows">
          <RiIcons.RiSettings2Line style={{width: '25px', fontSize: '18px', margin: '-6px 0 0 -13px'}} />
          <S.SettingsUl className={createSubMenuClass.join(' ')} > 
              <li className='sub-item' style={{borderBottom: '0px'}}> <S.SettingsLink onClick={(e:any)=>sortHandle(e, 'createItem', '/createItem', collection_id?collection_id:'',collection_address?collection_address:'')}> Add Item </S.SettingsLink> </li>
              <li className='sub-item' style={{borderBottom: '0px'}}><S.SettingsLink onClick={(e:any)=>sortHandle(e, 'updateCollection', '/collection/operation', collection_id?collection_id:'', '')}> Edit Collection </S.SettingsLink> </li>
              <li className='sub-item' style={{borderBottom: '0px'}}><S.SettingsLink onClick={(e:any)=>sortHandle(e, 'delete', '/collection/mycollection', '', '')}> Delete Collection </S.SettingsLink> </li>
          </S.SettingsUl>
        </S.SettingButton>
      </div>
      <div style={{width: '100%', textAlign: 'center', marginTop: '30px'}}>
        <span style={{fontSize: '36px', fontWeight: 'bold', color: 'black'}}>{name || 'Collection'} -  {w_strCategory}</span>
      </div>
      <div style={{width: '100%', textAlign: 'center', marginTop: '40px', paddingBottom: '30px'}}>        
        <S.InfoDiv>
          {item_count}
          <div>Items</div>
        </S.InfoDiv>
      </div>
    </S.Container>
  )
}

const S = {  
  SettingsLink: styled.div`
    color: ${props => props.theme.black};
    margin: 0 0 0 10px;
    background: ${props => props.theme.white};
    width: 100%;
    border: 0px;
    font-size: 15px;
    line-height: 2rem;
    &:hover,
    &:active,
    &:focus {
      background: ${props => props.theme.white};
    }
  `,
  SettingsUl: styled.ul `
    background: ${props => props.theme.white};
    width: 140px;
    margin-left: -100px !important;
    margin-top: 15px;
    text-align: left;
    @media (min-width: ${props => props.theme.viewport.desktop}) {
      margin-left: 5px;
    }
  `,
  InfoDiv: styled.div `
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    width: 100px;
    height: 70px;
    padding-top: 5px;
    border: 1px solid ${props=>props.theme.gray['1']};
    color: ${props=>props.theme.black};

    > div {
      font-size: 20px;
      font-weight: bold;
      color: ${props=>props.theme.black};
    }
  `,
  Container: styled.div `
    background: ${(props)=>props.theme.white};
    color: ${props=>props.theme.gray['4']};
  `,
  SettingInput: styled(Input)`
    opacity: 0;
    position: relative;
    width: 35px;
    height: 35px;
    appearance: none;
    cursor: default;
    align-items: baseline;
    color: inherit;
    text-overflow: ellipsis;
    white-space: pre;
    text-align: start !important;  
    background-color: -internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59));
    margin-left: -35px;
    padding: 1px 2px;
    border-width: 2px;
    border-style: inset;
    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
    border-image: initial;
  `,
  SettingButton: styled(Button)`
    background-color: ${(props)=>props.theme.gray['1']} !important;
    color: ${(props)=>props.theme.gray['3']};
    border: 1px solid ${(props)=>props.theme.gray['2']};
    border-radius: 5px;
    box-shadow: none;
    position: relative;
    width: 35px;
    height: 35px;
    padding: 4px 0 0 0;
    margin: 0px 5px;
  `,
  BannerInput: styled(Input)`
    opacity: 0;
    position: absolute;
    width: 35px;
    height: 35px;
    top: 90px;
    right: 5px;
    appearance: none;
    cursor: default;
    align-items: baseline;
    color: inherit;
    text-overflow: ellipsis;
    white-space: pre;
    text-align: start !important;  
    background-color: -internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59));
    margin: 0em;
    padding: 1px 2px;
    border-width: 2px;
    border-style: inset;
    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
    border-image: initial;
  `,
  BannerButton: styled(Button)`
    background-color: ${(props)=>props.theme.gray['1']} !important;
    color: ${(props)=>props.theme.gray['3']};
    border: 1px solid ${(props)=>props.theme.gray['2']};
    border-radius: 5px;
    box-shadow: none;
    position: absolute;
    width: 35px;
    height: 35px;
    top: 90px;
    right: 5px;
    padding: 0 0 0 3px;
  `,
  BannerImage: styled.div`
    width: 100%;
    heiht: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
  `
}

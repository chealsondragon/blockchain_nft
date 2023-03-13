import { Input, Image } from 'antd'
import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import * as FaIcons from 'react-icons/fa';
import { notifyWarning } from '../../services/NotificationService'
import {AppContext} from '../../contexts';
import {API} from '../../constants/api';
import {imageUpload} from '../../services/UserService';

export default function ProfileMain() {
  const {user, setUser, theme} =  useContext(AppContext);
  const [opacity, setOpacity] = useState(0);

  const onShow = () => {
    setOpacity(0.99);
  }
  const onHide = () => {
    setOpacity(0);
  }

  const onFileChange = async (e:any) => {
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
      setUser({...user, profile_image:filename});  
    }
  }

  return (
    <S.Container>
      <S.LogoDiv>
        {user.profile_image==''?
          <S.LogoImg src={API.server_url + API.user_profile_image + theme.theme + 'nouser.jpg'} alt='' /> 
          :
          <S.LogoImg src={API.server_url + API.user_profile_image + user.profile_image} alt='' /> 
        }
        <S.LogoInput type='file' name='logo' onChange={(e:any) => onFileChange(e)} multiple onMouseOver={onShow} onMouseOut={onHide} style={{opacity: opacity}} />
        <FaIcons.FaRegEdit style={{width: '20px', height: '20px', opacity: opacity, color: 'white', position: 'absolute'}} />  
      </S.LogoDiv>
      <div style={{width: '100%', textAlign: 'center', marginTop: '20px'}}>
        <span style={{fontSize: '25px', fontWeight: 'bold'}}>{'User Name'}</span>
      </div>
    </S.Container>
  )
}

const S = {  
  Container: styled.div `
    background: ${(props)=>props.theme.white};
    color: ${props=>props.theme.gray['4']};
    margin-top: 96px;
    padding: 20px 20px 0 20px;
  `,
  LogoImg: styled(Image) `
    border: 1px solid rgb(159 156 156);
    width: 200px !important;
    height: 200px !important;    
  `,
  LogoInput: styled(Input)`
    opacity: 0;
    appearance: none;
    cursor: pointer;
    align-items: baseline;
    border-radius: 50%;
    color: inherit; 
    width: 115px;
    height: 115px;
    position: absolute;
    &:hover,
    &:active,
    &:focus {
      background-color: rgb(150, 150, 150);
      opacity: 1;
    }
  `,
  LogoDiv: styled.div`
    width: 100%;
    height: 125px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px 0px;
    background: transparent;
  `
}

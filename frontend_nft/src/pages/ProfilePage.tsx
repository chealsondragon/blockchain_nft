import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { ProfilePageTemplate } from './template/ProfilePageTemplate';
import { validate, emailValidate } from '../services/ValidationService';
import { Button, Col, Row, Input, InputRef, Modal } from 'antd';
import { colors, fonts } from '../styles/variables';
import { AppContext } from '../contexts';
import { updateProfile, verify } from '../services/UserService';

export default function ProfilePage() {
  const {user, setUser} = useContext(AppContext);
  const [username, setUsername] = useState<string>(user.username);
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone);
  const [website_url, setWebsiteUrl] = useState<string>(user.website_url);
  const [twitter_info, setTwitterInfo] = useState<string>(user.twitter_info);
  const [telegram_info, setTelegramInfo] = useState<string>(user.telegram_info);
  const [desc, setDesc] = useState<string>(user.desc);
  const [opt_num, setOptNum] = useState<string>("");
  const [openstate, setOpenState] = useState<boolean>(false);

  const buttonElement:any = React.useRef<HTMLElement>(null);
  const emailElement:any = React.useRef<InputRef>(null);
  const phoneElement:any = React.useRef<InputRef>(null);
  const webElement:any = React.useRef<InputRef>(null);
  const twitterElement:any = React.useRef<InputRef>(null);
  const telegramElement:any = React.useRef<InputRef>(null);

  const handleKeyPress = (e: any, target: string) => {
    if(e.key === 'Enter'){
      switch(target) {
        case 'update':
          if(buttonElement.current)
            buttonElement.current.focus();
          break;
        case 'email':
          if(emailElement.current)
            emailElement.current.focus();
          break;
        case 'phone':
          if(phoneElement.current)
            phoneElement.current.focus();
          break;
        case 'web':
          if(webElement.current)
            webElement.current.focus();
          break;
        case 'twitter':
          if(twitterElement.current)
            twitterElement.current.focus();
          break;
        case 'telegram':
          if(telegramElement.current)
            telegramElement.current.focus();
          break;
        default:
          break;
      }
    }
  }

  const handleUpdate = async () => {
    if(!validate('Username', username)) return;
    if(!emailValidate(email)) return;
    let data = {username: username, account: user.account, email: email, phone: phone, website_url: website_url, twitter_info: twitter_info, telegram_info: telegram_info, profile_image: user.profile_image, desc: desc};
    if(await updateProfile(data))
    {
      setOptNum("")
      setOpenState(true);  
    }  
  }

  const submitVerify = async () => {
    if(!validate('Opt number', opt_num)) return;
    let data = {opt_code: opt_num};
    let userdata = await verify(data);
    if(userdata != undefined){    
      setUser({
        authenticated: userdata['authenticated'],
        username: userdata['username'], 
        email: userdata['email'],
        website_url: userdata['website_url'],
        twitter_info: userdata['twitter_info'],
        telegram_info: userdata['telegram_info'],
        account: userdata['account'],
        phone: userdata['phone'],
        profile_image: userdata['profile_image'],
        status: userdata['status'],
        desc: userdata['desc']
      })
    }
    setOpenState(false); 
  }

  return (
    <ProfilePageTemplate> 
      <S.Row>
        <header>Edit Profiles</header>
        <div style={{width: '100%', padding: '7px', borderRadius: '5px', cursor: 'pointer'}}>
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <S.InputDiv>
                User Name
                <S.Input maxLength={60} value={username} placeholder="Enter Username" onChange={(event:any) => setUsername(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'email')} />
              </S.InputDiv>
              <S.InputDiv>
                Email
                <S.Input maxLength={60} value={email} placeholder="Enter Email" onChange={(event:any) => setEmail(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'phone')} ref={emailElement}/>
              </S.InputDiv>
              <S.InputDiv>
                Phone Number
                <S.Input maxLength={60} value={phone} placeholder="Enter Phone Number" onChange={(event:any) => setPhone(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'web')} ref={phoneElement} />
              </S.InputDiv>
              <S.InputDiv>
                Website Url
                <S.Input maxLength={60} value={website_url} placeholder="Enter Website Url" onChange={(event:any) => setWebsiteUrl(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'twitter')} ref={webElement} />
              </S.InputDiv>
              <S.InputDiv>
                Twitter
                <S.Input maxLength={60} value={twitter_info} placeholder="Enter Twitter Info" onChange={(event:any) => setTwitterInfo(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'telegram')} ref={twitterElement} />
              </S.InputDiv>
              <S.InputDiv>
                Telegram
                <S.Input maxLength={60} value={telegram_info} placeholder="Enter Telegram Info" onChange={(event:any) => setTelegramInfo(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'update')} ref={telegramElement} />
              </S.InputDiv>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <S.InputDiv>
                Description
                <S.TextArea rows = {18} value={desc} onChange={(event:any) => setDesc(event.target.value)} >
                </S.TextArea>
              </S.InputDiv>
            </Col>
          </Row>
          <Row justify='center'>
            <S.ButtonDiv>
              <S.Button onClick={handleUpdate} ref={buttonElement}>
                Update Profile
              </S.Button>
            </S.ButtonDiv>
          </Row>
        </div>
      </S.Row>    
      <S.Modal open={openstate} keyboard={false} centered closable={false}>
        <center>
          <h1>Email Verification using OTP</h1>
          <div>
            <div>
              <S.Input maxLength={60} value={opt_num} placeholder="Enter OPT Number" onChange={event => setOptNum(event.target.value)} />
            </div>
            <div style={{marginTop: '20px'}}>
              <S.Button onClick={submitVerify}>
                Submit
              </S.Button>
            </div>
          </div>     
        </center>
      </S.Modal>
    </ProfilePageTemplate>
  )
}

export const S = {
  ButtonDiv: styled.div `
    width: 100%;
    display: inline-block;
    text-align: left;
    margin-top: 20px;
    @media (min-width: ${props => props.theme.viewport.desktop}) {
      margin-top: 0px;
      width: 50%;
      display: inline-block;
      text-align: center;
    }
  `,
  Span: styled.span `
    color: ${props=>props.theme.gray['2']};
    font-size: 12px;
    margin-left: 10px;
  `,
  InputDiv: styled.div `
    padding: 10px 20px 10px 20px;
  `,
  Input: styled(Input) `
    display: block;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    color: ${props=>props.theme.gray['4']};
    background-color: ${props=>props.theme.gray['0']};
    background-clip: padding-box;
    border: 1px solid ${props=>props.theme.gray['1']};
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  `,
  TextArea: styled(Input.TextArea) `
    display: block;
    width: 100%;
    resize: vertical;
    max-height: 405px;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 15;
    color: ${props=>props.theme.gray['4']};
    background-color: ${props=>props.theme.gray['0']};
    background-clip: padding-box;
    border: 1px solid ${props=>props.theme.gray['1']};
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  `,
  Button: styled(Button)`
    display: inline-block !important;
    margin-left: 20px !important;
    margin-bottom: 20px;
    background-color: rgb(34, 106, 237);
    color: ${colors.white};
    border-radius: 5px !important;
    padding: 3px 15px 5px 15px !important;
    cursor: pointer !important;
    border: 1px solid rgb(34, 106, 237);

    &:hover,
    &:active,
    &:focus {
      background-color: rgb(22, 22, 22);
      color: ${colors.white};
    }
  `,  
  Row: styled(Row)`
    display: flex;
    flex-wrap: wrap;
    border-radius: 5px;
    color: ${props=>props.theme.gray['4']};
    border: 1px solid ${props=>props.theme.gray['1']};

    header {
      width: 100%;
      height: 60px;
      padding: 1rem 1.25rem;
      margin-bottom: 0;
      background-color: ${props=>props.theme.gray['0']};
      border-bottom: 1px solid ${props=>props.theme.gray['1']};
    }

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      margin-top: 2rem;
      margin-bottom: 4.5rem;
    }

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      margin-top: 2rem;
      margin-bottom: 2.3rem;
    }
    @media (min-width: ${props => props.theme.viewport.desktopl}) {
      margin-top: 0px;
      margin-bottom: 2.3rem;
    }
    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      margin-bottom: 2.3rem;
    }
  `,
  Modal: styled(Modal)`
    .ant-modal-body {
      padding: 0;
    }
    .ant-modal-footer {
      display: none;
    }
    .ant-modal-content {
      background: ${props=>props.theme.gray['0']};
      border-radius: 16px;
      max-width: 300px;
      margin: auto;
      h1 {
        font-family: ${fonts.nunito};
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        color: ${props=>props.theme.gray[4]};
      }
      span {
        font-family: ${fonts.nunito};
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: white;
      }
    }
    .ant-modal-header {
      background: ${props=>props.theme.gray['0']};
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      border-bottom: none;
    }
  `
}

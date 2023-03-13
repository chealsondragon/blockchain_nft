import { code } from '../messages'
import { notifyError, notifyWarning } from './NotificationService'
import { API } from '../constants/api';
import axios from 'axios';
import jwt from 'jwt-decode'
import Cookies from 'universal-cookie';
import { UserData } from '../types/userType';

/************************************************
* this function is to request to server for login
*************************************************/
export const login = async (account: string) => {
    let w_return: UserData = {
        authenticated: false,
        username: "", 
        email: "",
        website_url: "",
        twitter_info: "",
        telegram_info: "",
        account: account,
        phone: "",
        profile_image: "",
        status: "",
        desc: ""
    };
    let w_data = {user_account: account}
    await axios.post(API.server_url + API.user_login, w_data)
    .then(response => {
        if(response.status == 200){
            let data:any = response.data;

            if(data.status){
                setCookie(data.token)
                w_return = jwt(data.token);
            }       
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

/************************************************
* this function is to save token to cookie
*************************************************/
const setCookie = (token:string) => {
    let d = new Date();
    d.setTime(d.getTime() + (API.cookie_expire*60*1000));
    const cookies = new Cookies();
    cookies.set("token", token, {path: "/", expires: d, sameSite: 'lax'});
}

/***************************************************************************
* this function is to request to server for uploading logo and cover images.
****************************************************************************/
export const imageUpload = async (data: any) => {
    let w_return = false;
    let url = '';

    url = API.server_url + API.user_profile_image_upload;
    
    await axios.post(url, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            w_return = data.status;
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })

    return w_return;
}

/************************************************
* this function is to request to server for login
*************************************************/
export const updateProfile = async (data: any) => {
    let w_return: boolean = false;

    const cookies = new Cookies();
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };

    await axios.post(API.server_url + API.user_update, data, headers)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                w_return = true;
            }       
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })
    
    return w_return;
}

/*
* this function is to request to server for verifying opt
*/
export const verify = async (data: any) => {
    let w_return: any = undefined;

    const cookies = new Cookies();
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };

    await axios.post(API.server_url + API.user_opt_verify, data, headers)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                setCookie(data.token)
                w_return = jwt(data.token);
                notifyWarning(data.message)
            }       
        }
    })
    .catch(error => {
        notifyError(code[5011], error)
    })
    
    return w_return;
}
import { useReactiveVar } from '@apollo/client'
import React,{useState, useContext, useEffect } from 'react';
import {NavLink} from 'react-router-dom';
import * as RiIcons from 'react-icons/ri';
import * as IoIcons from 'react-icons/io';
import styled, {useTheme} from 'styled-components'

import { AppContext } from "../../contexts";
import { WalletButton } from '../multi-wallet/WalletButton'
import { accountVar, chainIdVar, wrongNetworkModalVar } from '../../graphql/variables/WalletVariable'
import { isAllowedChain } from '../../services/UtilService'
import { NetworkConnected } from '../multi-wallet/NetworkConnected'
import WrongNetworkModal from '../multi-wallet/WrongNetworkModal'

export const Header = () => {
    const [isMenu, setisMenu] = useState(false);
    const [isResponsiveclose, setResponsiveclose] = useState(false);
    const {theme, setTheme} = useContext(AppContext);
    const themes:any = useTheme();
    const toggleClass = () => {
        setisMenu(isMenu === false ? true : false);
        setResponsiveclose(isResponsiveclose === false ? true : false);
    };

    let boxClass = ["main-menu menu-right menuq1"];
    if(isMenu) {
        boxClass.push('menuq2');
    }else{
        boxClass.push('');
    }

    const changeTheme = (e:any, val:any) => {
        e.preventDefault()
        localStorage.setItem('theme', val);
        setTheme({theme: val})
    }

    const account = useReactiveVar(accountVar);
    const chainId:number = useReactiveVar(chainIdVar);
    const rightChain = !!account && isAllowedChain(chainId)
    
    useEffect(() => {
        !account || rightChain ? wrongNetworkModalVar(false) : wrongNetworkModalVar(true)
    }, [account, rightChain])

    return (
        <S.Header className="header__middle" >
            {/* Add Logo  */}
            <S.Logo end className={({ isActive }) => isActive ? 'is-active' : undefined} to="/" />
            <div className="header__middle__menus">
                <nav className="main-nav " >
                    <S.SubMenu className={boxClass.join(' ')}>
                        <li  className="menu-item" >
                            <NavLink onClick={toggleClass} to={`/`} end className={({ isActive }) => isActive ? 'is-active' : undefined} style={{color: themes.gray['4']}}> Marketplace </NavLink> 
                        </li>
                        <li className="menu-item " ><NavLink onClick={toggleClass} className={({ isActive }) => isActive ? 'is-active' : undefined} to={`/trending`} style={{color: themes.gray['4']}}> Trending </NavLink> </li>
                        <li className="menu-item " ><NavLink onClick={toggleClass} className={({ isActive }) => isActive ? 'is-active' : undefined} to={`/stake`} style={{color: themes.gray['4']}}> Stake </NavLink> </li>
                    </S.SubMenu>
                </nav>     
            </div> 
            <WalletButton />
            {account && <NetworkConnected />}
            {/* {theme.theme=='dark'?
                <S.Sunny onClick={(e)=>changeTheme(e, 'light')} />
            :
                <S.Dark onClick={(e)=>changeTheme(e, 'dark')} />
            }         */}
            <S.Menu onClick={toggleClass} />
            <WrongNetworkModal />
        </S.Header>
    )
}

const S = {
    Header: styled.div `
        background: ${props=>props.theme.light};
    `,
    SubMenu: styled.ul `
        background: ${props=>props.theme.light} !important;
    `,
    Logo: styled(NavLink)`
        background: url(/logo/logo.png);
        height: 37px;
        width: 120px;
        background-size: 100% 100%;
        margin: 28px 0 0 15px;
        @media (min-width: 400px) {
            width: 100px;
        }
        @media(min-width: 420px) {
            width: 50px;
        }
    `,
    Sunny: styled(IoIcons.IoIosSunny)`
        margin: 5px;
        margin-top: 22px;
        font-size: 30px;
        padding: 12px;
        border: 1px solid rgb(133, 133, 133);
        border-radius: 50%;
        cursor: pointer;
        width: 35px;
        color: white;
        @media(min-width: 400px) {
            margin: 10px;
            margin-top: 22px;
            width: 35px;
        }
        @media(min-width: 420px) {
            width: 35px;
        }
        @media(min-width: 900px) {
            margin: 22px 30px 10px 30px;
            width: 30px;
        }
    `,
    Dark: styled(RiIcons.RiMoonLine)`
        margin: 5px;
        margin-top: 22px;
        font-size: 30px;
        padding: 12px;
        border: 1px solid rgb(133, 133, 133);
        border-radius: 50%;
        cursor: pointer;
        width: 35px;
        color: black;
        @media(min-width: 400px) {
            margin: 10px;
            margin-top: 22px;
            width: 35px;
        }
        @media(min-width: 420px) {
            width: 35px;
        }
        @media(min-width: 900px) {
            margin: 22px 30px 10px 30px;
            width: 30px;
        }
    `,
    Menu: styled(RiIcons.RiMenuLine)`
        color: rgb(133, 133, 133);
        border: 1px solid rgb(133, 133, 133);
        font-size: 45px;
        width: 120px;
        padding: 5px;
        margin: 5px;
        margin-top: 25px;
        border-radius: 5px;
        @media(min-width: 400px) {
            margin: 10px;
            margin-top: 25px;
            width: 100px;
        }
        @media(min-width: 420px) {
            width: 50px;
        }
        @media(min-width: 990px) {
            display: none;
        }
    `,

}
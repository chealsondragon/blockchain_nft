import { useReactiveVar } from '@apollo/client';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ThemeProviderEnum, themeVar } from '../graphql/variables/Shared';
import { chainIdVar, accountVar } from '../graphql/variables/WalletVariable';
import {AppContext} from '../contexts'
import { Header } from '../components/layout/Header';
import { login } from '../services/UserService';
import {UserData} from '../types/userType';

const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const MyCollectionPage = lazy(() => import('../pages/MyCollectionPage'))
const CreateColllectionPage = lazy(() => import('../pages/CreateCollectionPage'))
const CollectionViewPage = lazy(()=>import('../pages/CollectionViewPage'))
const MintPage = lazy(()=>import('../pages/MintPage'))
const StakePage = lazy(() => import('../pages/NftStakePage'))
const MarketplacePage = lazy(() => import('../pages/MarketplacePage'))
const TrendingPage = lazy(() => import('../pages/TrendingPage'))
const NotFoundPage = lazy(() => import('../pages/Page404'))

export default function Router() {
    const chainId = useReactiveVar(chainIdVar);
    const account = useReactiveVar(accountVar);
    const [theme, setTheme] = useState({theme: localStorage.getItem('theme') + ''});

    useEffect(()=> {
        if(theme.theme === 'dark') {
            themeVar(ThemeProviderEnum.dark);
        } else {
            themeVar(ThemeProviderEnum.light);
        }
    }, [theme])

    const [user, setUser] = useState<UserData>({
        authenticated: false,
        username: "", 
        email: "",
        website_url: "",
        twitter_info: "",
        telegram_info: "",
        account: "",
        phone: "",
        profile_image: "",
        status: "",
        desc: ""
    });

    useEffect(() => {
        const autoLogin = async (account: string) => {
            const userdata: UserData = await login(account);
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
    
        if(!!account && user != undefined && user.account != account)
          autoLogin(account);
    }, [account])

    return (
        <Suspense fallback={<Header />}>
            <AppContext.Provider value={{user, setUser, theme, setTheme}}>
                <Routes>
                    <Route path='/profile' element={<ProfilePage />} />         
                    <Route path='/collection/mycollection' element={<MyCollectionPage />} />
                    <Route path='/collection/operation' element={<CreateColllectionPage />} />
                    <Route path='/collection/view' element={<CollectionViewPage />} />
                    <Route path='/createItem' element={<MintPage />} />
                    <Route path='/stake' element={<StakePage />} />
                    <Route path='/trending' element={<TrendingPage />} />
                    <Route path='/' element={<MarketplacePage />} />
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </AppContext.Provider>
        </Suspense>
    )
} 

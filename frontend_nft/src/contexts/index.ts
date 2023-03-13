import { createContext, Dispatch, SetStateAction } from 'react';
import { UserData } from '../types/userType';

export interface ITheme {
  theme: string
}

export interface AppContextProperties {
  user: UserData,
  setUser: Dispatch<SetStateAction<UserData>>,
  theme: ITheme,
  setTheme: Dispatch<SetStateAction<ITheme>>
}

const AppContext = createContext<AppContextProperties>({ 
  user: {
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
  }, 
  setUser: () => {},
  theme: {
    theme: 'light'
  },
  setTheme: () => {}
});

export { AppContext };

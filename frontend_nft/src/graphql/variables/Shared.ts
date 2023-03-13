import { makeVar } from '@apollo/client';

export enum ThemeProviderEnum {
    light = 'light',
    dark = 'dark'
}

export const themeVar = makeVar<ThemeProviderEnum>(ThemeProviderEnum.light);
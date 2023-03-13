import { makeVar } from '@apollo/client';
import Web3 from 'web3';

export enum MultiWalletProvider {
    metaMask = 'metamask',
    walletConnect = 'walletconnect'
};

export const accountVar = makeVar<string | undefined>(undefined);
export const chainIdVar = makeVar<number>(1);
export const providerVar = makeVar<MultiWalletProvider | undefined>(undefined);
export const web3Var = makeVar<Web3 | undefined>(undefined);
export const walletVar = makeVar<string | undefined>(undefined)

export const connectWalletModalVar = makeVar<boolean>(false);
export const wrongNetworkModalVar = makeVar<boolean>(false);

export const setProviderStorage = (provider: MultiWalletProvider | undefined) => {
    providerVar(provider);
    provider ? window.localStorage.setItem('provider', provider) : window.localStorage.removeItem('provider');
}

export const setChainIdStorage = (chainId: number | undefined) => {
    chainIdVar(chainId);
    chainId ? window.localStorage.setItem('chainId', String(chainId)) : window.localStorage.removeItem('chainId');
}

export const clearMultiWalletVars = () => {
    accountVar(undefined);
    chainIdVar(1);
    setProviderStorage(undefined);
    setChainIdStorage(undefined);
    web3Var(undefined);
}
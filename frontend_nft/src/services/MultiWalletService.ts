/* eslint-disable no-console */
import detectEthereumProvider from '@metamask/detect-provider'
//import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3 from 'web3'
import { infuraKey, infuraAddress, bscNodeAddress } from '../config'
import {
  accountVar,
  chainIdVar,
  clearMultiWalletVars,
  MultiWalletProvider,
  setChainIdStorage,
  setProviderStorage,
  web3Var,
  walletVar
} from '../graphql/variables/WalletVariable'

interface MultiWalletService {
  connect(): Promise<void>
}

declare global {
  interface Window {
      ethereum: any;
  }
}

export const multiWalletService = (providerName: MultiWalletProvider, chainId: number): MultiWalletService => {
  switch (providerName) {
    case MultiWalletProvider.metaMask:
      return metaMaskProvider(chainId)

    case MultiWalletProvider.walletConnect:
      return metaMaskProvider(chainId) //walletConnectProvider(chainId)

    default:
      return metaMaskProvider()
  }
}

const metaMaskProvider = (chainIdParam?: number): MultiWalletService => {
  const listenEvents = () => {
    window.ethereum &&
      (window.ethereum as { on: (eventKey: string, callback: (accounts: string[]) => void) => void }).on(
        'accountsChanged',
        async (accounts: string[]) => {
          console.log('MM accountsChanged')
          if (accounts[0]) {
            accountVar(accounts[0])
          } else {
            clearMultiWalletVars()
          }
        }
      )

    window.ethereum &&
      (window.ethereum as { on: (eventKey: string, callback: (chainIdItem: string) => void) => void }).on(
        'chainChanged',
        async (chainIdItem: string) => {
          console.log('MM chainChanged', chainIdItem)
          chainIdVar(Number.parseInt(chainIdItem, 16))
        }
      )
  }

  return {
    connect: async () => {
      const provider = await detectEthereumProvider()

      if (provider && provider === window.ethereum) {
        try {
          const web3 = new Web3(Web3.givenProvider)

          const account = (
            await (window.ethereum as { request: (args: { method: string }) => Promise<string[]> }).request({
              method: 'eth_requestAccounts'
            })
          )[0]

          const chainId = Number.parseInt(
            await (window.ethereum as { request: (args: { method: string }) => Promise<string> }).request({
              method: 'eth_chainId'
            }),
            16
          )

          if (account && chainId) {
            accountVar(account)
            chainIdVar(chainId)
            setProviderStorage(MultiWalletProvider.metaMask)
            setChainIdStorage(chainId)
            web3Var(web3)
            walletVar('metamask')
            listenEvents()
          }

          console.log('MM account', account)
          console.log('MM chainId', chainId)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
}
/*
const walletConnectProvider = (chainIdParam?: number): MultiWalletService => {
  return {
    connect: async () => {
      try {
        let providerData = {}
        switch (chainIdParam) {
          case 1:
            providerData = {
              infuraId: infuraKey,
              chainId: 1
            }
            break
          case 5:
            providerData = {
              infuraId: infuraKey,
              chainId: 5
            }
            break
          case 56:
            providerData = {
              chainId: 56,
              rpc: {
                56: `https://bsc-dataseed.binance.org/`
              },
              qrcodeModalOptions: {
                mobileLinks: ['trust']
              }
            }
            break
          default:
            break
        }
        const provider = new WalletConnectProvider(providerData)
        await provider.enable()
        const web3 = new Web3(provider as never)
        const account = (await web3.eth.getAccounts())[0]
        const chainId = await web3.eth.getChainId()

        if (account && chainId) {
          accountVar(account)
          chainIdVar(chainId)
          setProviderStorage(MultiWalletProvider.walletConnect)
          setChainIdStorage(chainId)
          web3Var(web3)
          walletVar('walletconnect')

          provider.on('accountsChanged', async (accounts: string[]) => {
            console.log('WC accountsChanged', accounts)
            if (accounts[0]) {
              accountVar(accounts[0])
            } else {
              clearMultiWalletVars()
            }
          })

          provider.on('chainChanged', async (chainIdItem: number) => {
            console.log('WC chainChanged', chainIdItem)
            chainIdVar(chainIdItem)
          })

          provider.on('disconnect', async () => {
            console.log('WC disconnect')
            clearMultiWalletVars()
          })

          console.log('WC account', account)
          console.log('WC chainId', chainId)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
*/
export const initializeWeb3 = (chainId: number, node?: boolean | string) => {
  if (node === true) {
    if (chainId === 56) {
      return new Web3(new Web3.providers.HttpProvider(bscNodeAddress))
    }

    return new Web3(new Web3.providers.HttpProvider(infuraAddress))
  }

  return web3Var() || new Web3(Web3.givenProvider)
}

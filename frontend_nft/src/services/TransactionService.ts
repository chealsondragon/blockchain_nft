import { Transaction, transactionLoadingVar, transactionModalVar, transactionVar } from '../graphql/variables/TransactionVariable'
import { initializeWeb3 } from './MultiWalletService'

export interface TransactionService {
  confirm(hash: string, chainId: number, node: boolean, timer?: number, confirmed?: boolean): Promise<void>
  getConfirmations(hash: string, chainId: number, node: boolean): Promise<number>
}

export function transactionService(): TransactionService {
  return {
    confirm: async (txHash: string, chainId: number, node: boolean, timer = 10, confirmed = false) => {
      let confirmedTransaction = confirmed
      setTimeout(async () => {
        const confirmations = await transactionService().getConfirmations(txHash, chainId, node)
        if (confirmations >= 1) {
          const transaction = transactionVar()
          if (transaction) {
            const { hash, type, params } = transaction
            const transactionItem: Transaction = {
              hash,
              type,
              params,
              confirmed: true
            }
            transactionVar(transactionItem)
            transactionModalVar(false)
            transactionLoadingVar(false)
            confirmedTransaction = true
          } 
        } else {
          transactionService().confirm(txHash, chainId, node, 2, confirmedTransaction)
        }
      }, timer * 1000)
    },
    getConfirmations: async (hash: string, chainId: number, node: boolean) => {
      try {
        const web3 = initializeWeb3(chainId, node)
        const trx = await web3.eth.getTransaction(hash)
        const currentBlock = await web3.eth.getBlockNumber()
        return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber
      } catch (error) {
        return 0
      }
    }
  }
}

import BigNumber from 'bignumber.js'
import { allowedChains } from '../config'
import { Paged } from '../types/UtilTypes'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import erc721Abi from '../abi/erc721.json'

export default function paginator<T>(items: T[], current_page: number, per_page_items: number): Paged<T[]> {
  const page = current_page || 1;
  const per_page = per_page_items || 10;
  const offset = (page - 1) * per_page;

  const paginatedItems = items ? items.slice(offset).slice(0, per_page_items) : [];
  const total_pages = items ? Math.ceil(items.length / per_page) : 0;

  return {
    page,
    per_page,
    pre_page: page - 1 ? page - 1 : 0,
    next_page: total_pages > page ? page + 1 : 0,
    total: items.length,
    total_pages,
    data: paginatedItems
  };
}

export const getErc721Metadata = async (address: string, tokenId: string, web3: Web3) => {
  const contractErc2721 = new web3.eth.Contract(erc721Abi as AbiItem[], address)
  
  try {
    const tokenUri = await contractErc2721.methods.tokenURI(tokenId).call()
  } catch (e) {
    console.log("error")
    console.log(e)
  }
  
  // try {
  //   const metadata = await axios.get<{
  //     description: string
  //     image?: string
  //     imageUrl?: string
  //     social_media?: string
  //     author?: string
  //     name: string
  //     animation_url?: string
  //     attributes?: Erc721Attribute[] | Record<string, unknown>
  //     properties: Erc721Properties
  //   }>(safeIpfsUrl(tokenUri))
  //   //const metadata = await axios.get(safeIpfsUrl(cid))
  //   const author = getAuthor(metadata.data)
  //   const animation = await getAnimation(metadata.data)
  //   const { name, description, image } = metadata.data
  //   return {
  //     description,
  //     image_url: safeIpfsUrl(image),
  //     animation_url: safeIpfsUrl(animation),
  //     name,
  //     author,
  //     address,
  //     tokenId,
  //     social_media: metadata.data.social_media,
  //     attributes: metadata.data?.attributes,
  //     animationType: metadata.data?.properties?.preview_media_file_type?.description
  //   }
  // } catch (error) {
  //   Sentry.captureException(error)
  // }

  return {
    id: '',
    description: '',
    image_url: '',
    animation_url: '',
    social_media: '',
    name: '',
    address,
    tokenId,
    author: '',
    animationType: '',
    attributes: undefined,
    isStaking: false
  }
}

export function scale(input: BigNumber, decimalPlaces: number): BigNumber {
  const scalePow = new BigNumber(decimalPlaces.toString());
  const scaleMul = new BigNumber(10).pow(scalePow);
  return input.times(scaleMul);
}

export function valid(amount: string, decimals: number): boolean {
  const regex = new RegExp(`^\\d+${decimals > 0 ? `(\\.\\d{1,${decimals}})?` : ''}$`);
  return regex.test(amount);
}

export function units(coinsValue: string, decimals: number): string {
  if (!valid(coinsValue, decimals)) throw new Error('Invalid amount');
  let i = coinsValue.indexOf('.');
  if (i < 0) i = coinsValue.length;
  const s = coinsValue.slice(i + 1);
  return coinsValue.slice(0, i) + s + '0'.repeat(decimals - s.length);
}

export function coins(unitsValue: string, decimals: number): string {
  if (!valid(unitsValue, 0)) throw new Error('Invalid amount');
  if (decimals === 0) return unitsValue;
  const s = unitsValue.padStart(1 + decimals, '0');
  return `${s.slice(0, -decimals)}.${s.slice(-decimals)}`;
}

export function formatShortAddress(addressFormat: string): string {
  return `${addressFormat.slice(0, 6)}...${addressFormat.slice(-6)}`;
}

export function formatShortAddressDescriptionNft(addressFormat: string): string {
  return `${addressFormat.slice(0, 9)}...`;
}

export function formatShortAddressWallet(addressFormat: string): string {
  return `${addressFormat.slice(0, 9)}`;
}

export function dollarFormat(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function formatSymbol(tokenSymbol: string) {
  return tokenSymbol.length > 6 ? `${tokenSymbol.substr(0, 6)}...` : tokenSymbol;
}

export function formatDomain(domain: string) {
  const domainName = domain.substr(0, domain.lastIndexOf('.'));
  const domainType = domain.substr(domain.lastIndexOf('.'));
  const formattedName = domainName.length > 9 ? `${domainName.substr(0, 3)}...${domainName.substr(-3)}` : domainName;

  return `${formattedName}${domainType}`;
}

export const imgLH3 = (url: string, size: number): string => {
  return url.includes('https://lh3') ? `${url}=s${size}-c` : url;
}
export const safeIpfsUrl = (url: string): string => {
  if (url.includes('ipfs')) {
    return url;
  }
  return 'https://ipfs.io/ipfs/' + url;
}

export const isAllowedChain = (chainId: number): boolean => {
  return allowedChains.includes(chainId);
}

export const sleep = (ms = 100): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

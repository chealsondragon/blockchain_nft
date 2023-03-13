import { Erc3525Metadata } from '../types/nftType'
import { create } from 'ipfs-http-client'

export interface IpfsFileResponse {
  cid: string
  error: string
}

interface IpfsNFTService {
  uploadNFTToIpfs(data: Erc3525Metadata, image?: File, video?: File, audio?: File): Promise<IpfsFileResponse>
}

interface IpfsImageService {
  uploadImageToIpfs(image: File): Promise<IpfsFileResponse>
}

export const PinataIpfsNFTService = (): IpfsNFTService => {
  const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

  return {
    async uploadNFTToIpfs(data, image, video, audio): Promise<IpfsFileResponse> {   
      
      try {
        // let w_imageIpfs = await ipfs.add(image);
        // data.image = w_imageIpfs['path'];
        // const nftMetadataFile = JSON.stringify(data);
        // const _cid = await ipfs.add(nftMetadataFile);

        return {
          cid: 'QmSppX72tE98tQ7xUEbeNqehDhVqZ67u2AEKnsUkJEWpBb',//_cid['path']
          error: ''
        }
      } catch(e) {
        return { cid: '', error: 'upload failed' };
      }
    }
  }
}

export const PinataIpfsImageService = (): IpfsImageService => {
  const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

  return {
    async uploadImageToIpfs(image): Promise<IpfsFileResponse> {   
      
      try {
        let _cid = await ipfs.add(image);
        return {
          cid: _cid['path'],
          error: ''
        }
      } catch(e) {
        return { cid: '', error: 'upload failed' };
      }
    }
  }
}

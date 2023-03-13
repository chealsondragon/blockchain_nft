import { LoadingOutlined } from '@ant-design/icons'
import { useReactiveVar } from '@apollo/client'
import { Modal, Spin } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { wrongNetworkModalVar } from '../../graphql/variables/WalletVariable'
import { colors, fonts } from '../../styles/variables'

export default function WrongNetworkModal() {
  const wrongNetworkModal = useReactiveVar(wrongNetworkModalVar)
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  return (
    <S.Modal open={!!wrongNetworkModal} keyboard={false} centered closable={false}>
      <center>
        <S.Spin indicator={antIcon} />
        <h1>Wrong network</h1>
        <span>Change your network</span>
        </center>
    </S.Modal>
  )
}

export const S = {
  Modal: styled(Modal)`
    .ant-modal-body {
      padding: 0;
    }
    .ant-modal-footer {
      display: none;
    }
    .ant-modal-content {
      background: ${props=>props.theme.gray['0']};
      border-radius: 16px;
      max-width: 300px;
      margin: auto;
      h1 {
        font-family: ${fonts.nunito};
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        color: ${props=>props.theme.gray[4]};
      }
      span {
        font-family: ${fonts.nunito};
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: ${props=>props.theme.gray[4]};
      }
    }
    .ant-modal-header {
      background: ${props=>props.theme.gray['0']};
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      border-bottom: none;
    }
  `,
  Spin: styled(Spin)`
    margin-bottom: 16px;
  `
}

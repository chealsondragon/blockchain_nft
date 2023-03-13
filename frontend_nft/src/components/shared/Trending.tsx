import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import *  as IoIcons from 'react-icons/io';
import { Button, Row, Col } from 'antd'
import { colorsV2, fonts, viewport, viewportV2 } from '../../styles/variables'
import emptyMessageIcon from '../../assets/invoice.png'

export const Trending = () => {

  const handleFilter = (e:any, val:any) => {

  }

  const transactions: Array<any> = [
  //   {
  //   id: #1,
  //   Rank: 1,
  //   addr: '0xadcge43565aaasessa',
  //   Owners: 1,
  //   NFTs_Sold: 77Eth,
  //   Primary_Sales: 5Eth,
  //   Secondary_Sales: 6Eth,
  //   Total_Sales: 11.2Eth
  // }
]

  return (
    <Row>
      <S.Title>
        <IoIcons.IoIosArrowDown />
        Trending
      </S.Title>
      <Row style={{width: '100%'}}>
        <Col xs={24} sm={24} md={12} lg={11} xl={8}>
            <S.Button onClick={(e:any)=>handleFilter(e, 'startAuction')}>Collections</S.Button>
            <S.Button onClick={(e:any)=>handleFilter(e, 'startAuction')}>Creators</S.Button>
            <S.Button onClick={(e:any)=>handleFilter(e, 'startAuction')}>Collectors</S.Button>           
        </Col>
        <Col xs={24} sm={24} md={1} lg={4} xl={9}></Col>
        <Col xs={24} sm={24} md={11} lg={9} xl={7}>
            <S.Button onClick={(e:any)=>handleFilter(e, 'startAuction')}>1d</S.Button>
            <S.Button onClick={(e:any)=>handleFilter(e, 'startAuction')}>7d</S.Button>
            <S.Button onClick={(e:any)=>handleFilter(e, 'startAuction')}>30d</S.Button>
            <S.Button onClick={(e:any)=>handleFilter(e, 'startAuction')}>AllTime</S.Button>
        </Col>
      </Row>
      <Row style={{width: '100%'}}>
        <S.TransactionsTable className={'scrollable-y'}>
            <thead>
              <tr>
                <th className='desktop'>Rank</th>
                <th className='desktop'></th>
                <th className='desktop'>Owners</th>
                <th className='desktop'>NFTs Sold</th>
                <th className='desktop'>Primary Sales</th>
                <th className='mobile'>Secondary Sales</th>
                <th className='mobile'>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td className='empty'>
                    <S.EmptyMessage>
                      <img src={emptyMessageIcon} alt='No transactions available.' />
                      <span>No Trending available.</span>
                    </S.EmptyMessage>
                  </td>
                </tr>
              )}
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className='desktop'>{transaction.Rank}</td>
                  <td className='desktop'>{transaction.addr}</td>
                  <td className='desktop'>{transaction.Owners}</td>
                  <td className='desktop'>
                    {transaction.NFTs_Sold}
                  </td>
                  <td className='desktop'>
                    {transaction.Primary_Sales}
                  </td>
                  <td className='mobile'>
                    {transaction.Secondary_Sales}
                  </td>
                  <td className='mobile'>
                    {transaction.Total_Sales}
                  </td>
                </tr>
              ))}
            </tbody>
          </S.TransactionsTable>
      </Row>
    </Row>
  )
}

const S = {
  Button: styled(Button)`
    background: ${props=>props.theme.white};
    color: ${props=>props.theme.black};
    border: 1px solid ${props=>props.theme.gray['1']};
    border-radius: 10px !important;
    padding: 5px 15px 7px 15px !important;
    cursor: pointer !important;
    height: 35px;
    margin: 10px 10px;
    &:hover,
    &:active,
    &:focus {
      background-color: rgb(34, 106, 237);
    }
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      margin-top: 0px;
      margin-right: 0px !important;
    }
  `,
  Title: styled.div`
    width: 100%;
    color: ${props=>props.theme.gray['4']};
    margin-bottom: 15px;
    font-size: 28px;
    font-weight: bold;
    >svg {
      margin-right: 0.5rem;
      position: relative;
      top: 5px;
    }
  `,
  TransactionsTable: styled.table`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border: 1px solid ${props=>props.theme.gray['1']};
    margin: 20px 0px;
    padding: 10px;
    &.scrollable-y {
      > thead {
        > tr {
          > th {
            &:last-child {
              text-align: center;
            }
          }
        }
      }
      > tbody {
        overflow-y: scroll;
        height: 238px;
        > tr {
          > td {
            &:last-child {
              text-align: center;
            }
          }
        }
      }
    }
    > thead {
      display: flex;
      > tr {
        display: flex;
        width: 100%;
        gap: 8px;
        > th {
          &:last-child {
            text-align: right;
            &.empty {
              text-align: center;
            }
          }
          font-size: 12px;
          line-height: 16px;
          color: ${props=>props.theme.gray['3']};
          font-weight: 400;
          &.desktop {
            display: block;
            width: 25%;
            @media (max-width: ${viewport.sm}) {
              display: none;
            }
          }
          &.mobile {
            display: none;
            &:not(:nth-child(2)) {
              width: 40%;
            }
            &:nth-child(2) {
              width: 30%;
            }
            @media (max-width: ${viewport.sm}) {
              display: block;
            }
          }
          @media (max-width: ${viewport.sm}) {
            font-size: 10px;
            line-height: 13px;
          }
          &.desktop {
            display: block;
            @media (max-width: ${viewport.sm}) {
              display: none;
            }
          }
          &.mobile {
            display: none;
            @media (max-width: ${viewport.sm}) {
              display: block;
            }
          }
        }
      }
    }
    > tbody {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      > tr {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        gap: 8px;
        > td {
          text-align: center;
          color: ${props=>props.theme.black};
          font-size: 16px;
          line-height: 20px;
          font-weight: 500;
          padding: 20px 0;
          word-break: break-all;
          @media (max-width: ${viewport.sm}) {
            font-size: 10px;
            line-height: 13px;
          }
          &.desktop {
            display: block;
            width: 25%;
            @media (max-width: ${viewport.sm}) {
              display: none;
            }
          }
          &.mobile {
            display: none;
            &:not(:nth-child(2)) {
              width: 40%;
            }
            &:nth-child(2) {
              width: 30%;
            }
            @media (max-width: ${viewport.sm}) {
              display: block;
            }
          }
          &.empty {
            width: 100%;
            height: 100%;
            border-bottom: none;
            padding: 34px 0 18px 0;
          }
          &:last-child {
            text-align: right;
            &.empty {
              text-align: center;
            }
          }
        }
      }
    }
  `,
  EmptyMessage: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: ${props=>props.theme.gray['3']};
    > img {
      width: 32px;
      height: 32px;
    }
  `
}

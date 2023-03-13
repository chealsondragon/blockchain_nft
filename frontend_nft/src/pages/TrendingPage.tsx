import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { colors, fonts, viewport } from '../styles/variables'
import { DefaultPageTemplate } from './template/DefaultPageTemplate'
import { Trending } from '../components/shared/Trending'

export default function MainPage() {

  const redirect = (url: string) => {
    window.location.href = url
  }

  return (
    <DefaultPageTemplate noMargin fullWidth>
      <S.Container>        
        <Trending />
      </S.Container>
    </DefaultPageTemplate>
  )
}

export const S = {
  Container: styled.div`
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 30px;
    width: 100%;
    @media (min-width: ${viewport.sm}) {
      max-width: 80%;
    }
    @media (min-width: ${viewport.md}) {
      max-width: 80%;
    }
  `
}

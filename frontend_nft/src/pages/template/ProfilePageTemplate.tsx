import React, { ReactNode, useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import ProfileMain from '../../components/profile/ProfileMain';
import { Footer } from '../../components/layout/Footer'
import { Header } from '../../components/layout/Header'

export type ProfileTemplatePageProps = {
  children: ReactNode
}

export function ProfilePageTemplate({ children }: ProfileTemplatePageProps) {

  return (
    <> 
      <Header />
      <S.Main>
        <ProfileMain />
      </S.Main>   
      <S.Contents> 
        {children}
      </S.Contents>
      <Footer />
    </>
  )
}

export const S = {
  Main: styled.div `
    background: #F6F6F6;
  `,
  Contents: styled.div `
    padding: 3px 24px;
    background: ${props => props.theme.white};
    display: block;
    align-items: center;
  `
}

import styled from 'styled-components'

export const HomeContainer = styled.div`
  margin: 0;
  padding: 0;
  height: 100%;
`

export const SideBar = styled.div`
  display: flex;
  position: absolute;
  left: 0.5rem;
  top: 2vh;
`

export const BottomBar = styled.div`
  display: flex;
  position: absolute;
  bottom: 1rem;
  left: 5vw;
  right: 5vw;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 70vw; /* Need a specific value to work */
`
export const BottomLeft = styled.div`
  z-index: 9999999;
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  margin-left: auto;
  margin-right: auto;
  width: 50rem;
  height: auto;
`

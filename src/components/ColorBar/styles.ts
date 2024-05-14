import styled from 'styled-components'

export const ColorBarContainer = styled.div`
  padding: 0.375rem;
  z-index: 9000;
  display: block;
  /* background-color: rgba(0, 0, 0, 0.4); */
`

export const ColorBarItem = styled.div`
  padding-left: 0.1rem;
  padding-right: 0.1rem;
  padding-bottom: 0.375rem;
  padding-top: 0.375rem;
  p {
    opacity: 0;
    color: rbga(0, 0, 0, 0);
  }
`

import styled from 'styled-components'

export const LayerSelectionContainer = styled.div`
  margin-left: -2.375rem;
  height: 90vh;
  width: 18rem;
  z-index: 9999;
  background-color: ${(props) => props.theme['white']};
  z-index: 9998;
  border-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme['black']};
  padding-bottom: 0.75rem;
`

export const LayerSelectionTitle = styled.div`
  width: 100%;
  background: ${(props) => props.theme['blue-500']};
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  margin: 0;
  h1{
    padding: 0.375rem;
    padding-right: 2rem;
    margin-left: 3.5rem;
    font-size: 1.5rem;
    font-weight: bold;
  }
`

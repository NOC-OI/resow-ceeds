import styled from 'styled-components'

export const LayerSelectionContainer = styled.div`
  margin-left: -2.30rem;
  height: 90vh;
  width: 22rem;
  background-color: ${(props) => props.theme['white']};
  z-index: 9998;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom-left-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme['black']};
  padding-bottom: 0.75rem;
`

export const LayerSelectionTitle = styled.div`
  width: 100%;
  height: 2.5rem;
  background: ${(props) => props.theme['blue-500']};
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  margin: 0;
  h1{
    padding: 0.375rem;
    padding-right: 2rem;
    margin-left: 3rem;
    font-size: 1.5rem;
    font-weight: bold;
  }
`

export const LayerTypes = styled.div`
  height: calc(90vh - 2.5rem + 0.75rem);
  max-height:90vh;
  overflow-y:auto;
`

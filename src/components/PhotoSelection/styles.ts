import styled from 'styled-components'

export const PhotoSelectionContainer = styled.div`
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

export const PhotoSelectionTitle = styled.div`
  width: 100%;
  height: 2.5rem;
  background-color: ${(props) => props.theme['blue-500']};
  background-image: linear-gradient(315deg, ${(props) => props.theme['blue-500']} 0%, ${(props) => props.theme['blue-300']} 74%);
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  margin: 0;
  text-align: center;
  h1{
    padding: 0.375rem;
    padding-right: 2rem;
    margin-left: 3rem;
    font-size: 1.5rem;
    font-weight: bold;
  }
`

export const PhotoTypes = styled.div`
  height: calc(90vh - 2.5rem + 0.75rem);
  max-height:90vh;
  overflow-y:auto;
`

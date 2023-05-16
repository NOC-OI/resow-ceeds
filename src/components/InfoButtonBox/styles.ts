import styled from 'styled-components'

export const InfoButtonBoxContainer = styled.div`
  right: 0.5rem;
  top: 5vh;
  width: 20rem;
  background-color: ${(props) => props.theme['white']};
  z-index: 9999;
  max-height: 60vh;
  overflow-y: auto;
  margin-left: 1rem;
  padding: 0.5rem;
  border-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme['black']};
  z-index: 9999;
  white-space: pre-line;
  h1{
    font-size: 0.85rem;
    line-height: 1;
    text-align: center;
    padding-bottom: 0.375rem;
  }
  p{
    font-size: 0.75rem;
    line-height: 1.6;
    text-align: justify;
  }
  div:first-child{
    display: flex;
    justify-content: flex-end;
    padding-bottom: 0.375rem;
  }
  svg{
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme['yellow-700']};
    }
  }
`

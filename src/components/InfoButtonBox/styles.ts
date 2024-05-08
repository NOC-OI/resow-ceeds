import styled from 'styled-components'

export const InfoButtonBoxContainer = styled.div`
  margin-left: 1rem;
  left: 100%;
  top: 5vh;
  background-color: rgba(17, 17, 17, 0.6);
  color: ${(props) => props.theme.white};
  z-index: 9999;
  position: absolute;
  padding: 0.5rem;
  border-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme.black};
  z-index: 9999;
  white-space: pre-line;
  overflow-y: auto;
  overflow-x: hidden;
  h1 {
    font-size: 0.85rem;
    line-height: 1;
    text-align: center;
    padding-bottom: 0.375rem;
  }
  div:first-child {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 0.375rem;
  }
  a {
    text-decoration: underline;
    color: white;
    font-weight: bold;
  }
  svg {
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme['yellow-700']};
    }
  }
`

export const InfoButtonBoxContent = styled.div`
  max-height: calc(90vh - 10rem);
  overflow-y: auto;
  overflow-x: hidden;
  p {
    font-size: 0.8rem;
    line-height: 1.6;
    text-align: justify;
    padding-bottom: 0rem;
  }
`

import styled from 'styled-components'

export const LayerLegendContainer = styled.div`
  overflow-y: auto;
  overflow-x: auto;
  left: 100%;
  top: 5vh;
  position: absolute;
  height: max-content;
  min-width: 15rem;
  max-width: 40rem;
  background-color: rgba(17, 17, 17, 0.6);
  color: ${(props) => props.theme.white};
  z-index: 9999;
  max-height: 90vh;
  margin-left: 1rem;
  padding: 0.5rem;
  border-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme.black};
  z-index: 9999;
  div:nth-child(2) {
    overflow: hidden;
  }
  h1 {
    font-size: 0.85rem;
    line-height: 1;
    text-align: center;
    padding-bottom: 0.375rem;
  }
  p {
    font-size: 0.75rem;
    line-height: 1.6;
    text-align: center;
  }
  svg {
    text-align: right;
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme['yellow-700']};
    }
  }
`

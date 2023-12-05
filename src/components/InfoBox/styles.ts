import styled from 'styled-components'

export const InfoBoxContainer = styled.div`
  position: absolute;
  right: 0.5rem;
  bottom: 5vh;
  width: 11rem;
  background-color: rgba(17, 17, 17, 0.6); /* Black */
  z-index: 9999;
  height: max-content;
  margin-left: 1rem;
  padding: 0.5rem;
  border-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme.white};
  z-index: 9999;
  color: ${(props) => props.theme.white};
  h1 {
    font-size: 1rem;
    line-height: 1.6;
    text-align: center;
  }
`

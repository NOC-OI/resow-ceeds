import styled from 'styled-components'

export const InfoBoxContainer = styled.div`
  position: absolute;
  right: 0.5rem;
  bottom: 5vh;
  width: max-content;
  background-color: rgba(17, 17, 17, 0.6); /* Black */
  z-index: 9999;
  height: max-content;
  margin-left: 1rem;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme.white};
  z-index: 9999;
  color: ${(props) => props.theme.white};
`

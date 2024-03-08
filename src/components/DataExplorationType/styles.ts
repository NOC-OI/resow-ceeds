import styled from 'styled-components'

export const LayerTypeContainer = styled.div`
  margin: 0.5rem;
  border-radius: 16px;
  padding: 0.375rem;
  box-shadow: 1px 1px 1px ${(props) => props.theme.white};
  header {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    &:hover {
      color: ${(props) => props.theme['yellow-700']};
    }
  }
`

export const CalcTypeContainer = styled.div`
  color: rgba(255, 255, 255, 0.7);

  margin: 0.5rem;
  border-radius: 16px;
  padding: 0.375rem;
  font-weight: bold;
  /* box-shadow: 1px 1px 1px ${(props) => props.theme.white}; */
  header {
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: 0.875rem;
    padding-right: 0.25rem;
    cursor: pointer;
    &:hover {
      color: rgba(255, 255, 255, 1);
      /* color: ${(props) => props.theme['yellow-700']}; */
    }
    svg {
      padding-right: 0.5rem;
      width: 0.875rem;
      height: 0.875rem;
    }

    /* svg {
      &:hover {
        color: ${(props) => props.theme['yellow-700']};
      }
    } */
  }
`

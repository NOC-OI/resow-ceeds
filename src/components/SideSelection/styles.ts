import styled from 'styled-components'

export const SideSelectionContainer = styled.div`
  height: 90vh;
  background-color: ${(props) => props.theme['white']};
  padding: 0.375rem;
  width: 2rem;
  z-index: 9999;
  border-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme['black']};
`

export const SideSelectionLink = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;

  &:first-child {
    padding-top: 1rem;
  }

  svg {
    cursor: pointer;
    padding-bottom: 1rem;
    height: 1.5rem;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.theme['yellow-700']};

    &:hover {
      color: ${(props) => props.theme['yellow-400']}
    }

    &.active {
      color: ${(props) => props.theme['yellow-400']};
    }
  }
`

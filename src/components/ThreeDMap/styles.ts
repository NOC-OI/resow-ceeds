import styled from 'styled-components'

export const ResiumContainer = styled.div`
  /* div:first-child {
    div:first-child {
      height: 500px;
    }
  } */
`

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  nav {
    display: flex;
    gap: 0.5rem;
    a {
      width: 3rem;
      height: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: ${(props) => props.theme['gray-100']};
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
      cursor: pointer;

      &:hover {
        border-bottom: 3px solid ${(props) => props.theme['green-700']};
      }

      &.active {
        color: ${(props) => props.theme['green-700']};
      }
    }
  }
`

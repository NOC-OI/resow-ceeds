import styled from 'styled-components'

export const LayerTypeOptionsContainer = styled.div`
  font-size: 0.65rem;
  font-weight: normal;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    label {
      opacity: 0.7;
      :hover {
        opacity: 1;
      }
      display: flex;
      align-items: center;
      padding-right: 0.675rem;
      white-space: nowrap;
      padding: 0.375rem;
      cursor: pointer;
      input[type='checkbox'] {
        vertical-align: middle;
        padding-right: 0.25rem;
        ::selection {
          background-color: ${(props) => props.theme['blue-500']} !important;
        }

        ::-moz-selection {
          background-color: ${(props) => props.theme['blue-500']} !important;
        }
      }
      p {
        vertical-align: middle;
        padding-left: 0.25rem;
        color: ${(props) => props.theme.white};
      }
    }
    svg {
      padding-left: 0.375rem;
      cursor: pointer;
      &:hover {
        color: ${(props) => props.theme['yellow-700']};
      }
    }
  }
  input[type='range']:focus {
    box-shadow: none;
    outline: none;
  }
  input[type='range'] {
    width: 100%;
    accent-color: ${(props) => props.theme['yellow-700']};
  }
`

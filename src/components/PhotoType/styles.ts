import styled from 'styled-components'


export const PhotoTypeContainer = styled.div`
  margin: 0.5rem;
  margin-left: 3rem;
  border-radius: 16px;
  padding: 0.375rem;
  box-shadow: 0px 4px 4px ${(props) => props.theme['black']};
  header{
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

export const PhotoTypeOptionsContainer = styled.div`
  font-size: 0.65rem;
  div{
    display: flex;
    justify-content: space-between;
    align-items: center;
    label{
      display: flex;
      align-items: center;
      padding-right: 10px;
      white-space: nowrap;
      padding: 0.375rem;
      cursor: pointer;
      input[type=checkbox]{
        vertical-align: middle;
        padding-right: 0.25rem;
        ::selection{
          background-color: ${(props) => props.theme['blue-500']} !important;
        }

        ::-moz-selection{
          background-color: ${(props) => props.theme['blue-500']} !important;
        }
      }
      p {
        vertical-align: middle;
        padding-left: 0.25rem;
      }
    }
    svg{
      padding-left: 0.375rem;
      cursor: pointer;
      &:hover {
        color: ${(props) => props.theme['yellow-700']};
      }
    }
  }
  input[type=range]{
    width: 100%
  }
`
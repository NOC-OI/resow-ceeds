import styled from 'styled-components'

export const LatLonLimitsContainer = styled.div`
  padding-top: 0.5rem;
  label{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom:0.5rem;
    p{
      width: 6rem;
      font-size: 0.65rem;
    }
    input{
      width: 4rem;
      height: 0.9rem;
      font-size: 0.65rem;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type=number] {
      -moz-appearance: textfield;
    }
    input:disabled{
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
`

export const CalcSelectionContainer = styled.div`
  margin-left: -2.3rem;
  height: 90vh;
  width: 18rem;
  background-color: ${(props) => props.theme['white']};
  z-index: 9998;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom-left-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme['black']};
  padding-bottom: 0.75rem;
  text-align: center;
`
export const CalcSelectionArea = styled.div`
  padding: 0.375rem;
  padding-top: 0.5rem;
  margin-left: 3rem;
  align-items: center;
  text-align: center;
  padding-right: 2rem;
  h1{
    padding-bottom: 0.375rem;
    font-size: 1rem;
    font-weight: bold;
  }
`

export const CalcButtonSelection = styled.div`
  /* padding: 0.375rem; */
  div:first-child{
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 2rem;
  }
`

export const ActiveButton = styled.div`
  svg{
    width: 4rem;
    color:  ${(props) => props.theme['black']};
    background: ${(props) => props.theme['yellow-400']};
    border-radius: 9px;
    padding: 0.375rem;
    box-shadow: 0px 4px 4px ${(props) => props.theme['black']};
    cursor: pointer;
    &:hover {
      color:  ${(props) => props.theme['gray-300']};
    }
  }
`

export const Button = styled.div`
  svg{
    width: 4rem;
    color:  ${(props) => props.theme['black']};
    border-radius: 9px;
    padding: 0.375rem;
    box-shadow: 0px 4px 4px ${(props) => props.theme['black']};
    cursor: pointer;
    &:hover {
      background: ${(props) => props.theme['yellow-400']};
      color:  ${(props) => props.theme['gray-300']};
    }
  }
`


export const CalcSelectionTitle = styled.div`
  width: 100%;
  height: 2.5rem;
  background-color: ${(props) => props.theme['blue-500']};
  background-image: linear-gradient(315deg, ${(props) => props.theme['blue-500']} 0%, ${(props) => props.theme['blue-300']} 74%);
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  margin: 0;
  h1{
    padding: 0.375rem;
    padding-right: 2rem;
    margin-left: 3rem;
    font-size: 1.5rem;
    font-weight: bold;
  }
`

export const CalcTypes = styled.div`
  padding-top: 0rem;
  h1{
    margin-left: 3rem;
    padding-right: 2rem;
    /* padding-bottom: 0.375rem; */
    font-size: 1rem;
    font-weight: bold;
  }
`

export const CalcTypesWithoutTitle = styled.div`
  height: calc(90vh - 2.5rem - 0.75rem - 1rem - 2rem - 0.75rem - 1.375rem - 0.5rem - 2rem - 3.55rem);
  max-height: calc(90vh - 2.5rem - 0.75rem - 1rem - 2rem - 0.75rem - 1.375rem - 0.5rem - 2rem - 3.55rem);
  overflow-y:auto;
`

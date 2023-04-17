import styled from 'styled-components'

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
  padding-top: 1rem;
  margin-left: 3rem;
  align-items: center;
  text-align: center;
  padding-right: 2rem;
  h1{
    padding-bottom: 0.375rem;
    font-size: 1rem;
    font-weight: bold;
  }
  div{
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 2rem;
  }
`
export const ActiveButton = styled.div`
  width: 100%;
  svg{
    color:  ${(props) => props.theme['black']};
    background: ${(props) => props.theme['yellow-400']};
    width: 100%;
    margin: 0.5rem;
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
  width: 100%;
  svg{
    color:  ${(props) => props.theme['black']};
    width: 100%;
    margin: 0.5rem;
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
  background: ${(props) => props.theme['blue-500']};
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
  padding-top: 0.75rem;
  h1{
    margin-left: 3rem;
    padding-right: 2rem;
    padding-bottom: 0.375rem;
    font-size: 1rem;
    font-weight: bold;
  }
`

export const CalcTypesWithoutTitle = styled.div`
  height: calc(90vh - 2.5rem - 0.75rem - 1rem - 2rem - 0.75rem - 1.375rem);
  max-height: calc(90vh - 2.5rem - 0.75rem - 1rem - 2rem - 0.75rem - 1.375rem);
  overflow-y:auto;
`

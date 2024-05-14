import styled from 'styled-components'

export const RangeSelectionContainer = styled.div`
  position: relative;
  color: white;
  padding: 0.5rem;
  border-radius: 16px;
  background-color: rgba(17, 17, 17, 0.6);
  text-shadow: 0 0 3px ${(props) => props.theme.black},
    0 0 5px ${(props) => props.theme.black};
  width: 65vw;
  z-index: 9000;
  font-size: 1rem;
  input[type='range'] {
    :focus {
      box-shadow: none;
    }
    /* margin-top: 20px; */
    width: 100%;
    -webkit-appearance: none;
    &:focus {
      outline: none;
    }
    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 12px;
      cursor: pointer;
      box-shadow: none;
      border-radius: 0px;
      border: 1px solid ${(props) => props.theme['blue-600']};
    }
    &::-moz-range-track {
      width: 100%;
      height: 12px;
      cursor: pointer;
      box-shadow: none;
      background: ${(props) => props.theme.white};
      border-radius: 0px;
      border: 1px solid ${(props) => props.theme['blue-600']};
    }

    &::-webkit-slider-thumb {
      box-shadow: none;
      border: 0px solid ${(props) => props.theme.white};
      box-shadow: 10px 10px 10px rgba(0, 0, 0, 1);
      height: 2rem;
      width: 2rem;
      border-radius: 22px;
      background: rgba(255, 255, 255, 1);
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -0.65rem;
    }
    &::-moz-range-thumb {
      box-shadow: none;
      border: 0px solid ${(props) => props.theme.white};
      box-shadow: 10px 10px 10px rgba(0, 0, 0, 1);
      height: 2rem;
      width: 2rem;
      border-radius: 22px;
      background: ${(props) => props.theme.black};
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -20px;
    }
    &::-moz-focus-outer {
      border: 0;
    }
  }
`

export const RangeValue = styled.div`
  margin-top: 1rem;
  p {
    /* box-shadow: 10px 10px 10px rgba(0, 0, 0, 1); */
    width: max-content;
    padding: 0.5rem;
    border-radius: 8px;
  }
`

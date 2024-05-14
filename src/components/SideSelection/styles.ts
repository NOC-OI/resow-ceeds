import styled from 'styled-components'

export const SideSelectionContainer = styled.div`
  position: relative;
  max-height: 80vh;
  background-color: rgba(17, 17, 17, 0.6); /* Black */
  border-radius: 30px;
  font-size: 1rem;
  padding: 0.375rem;
  z-index: 9999;
  border-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme.black};
`

export const SideSelectionLink = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  svg {
    cursor: pointer;
    height: 2rem;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.7);
    &:hover {
      color: rgba(255, 255, 255, 1);
    }
  }
`

export const SideSelectionLinkFinal = styled.header`
  position: absolute;
  bottom: 0rem;
`

export const ContrastSelectorContainer = styled.div`
  left: calc(1.5rem + 0.375rem + 0.25rem);
  top: 0;
  position: absolute;
  width: max-content;
  background-color: ${(props) => props.theme.white};
  z-index: 9999;
  height: max-content;
  margin-left: 1rem;
  padding: 0.5rem;
  border-radius: 16px;
  box-shadow: 0px 4px 4px ${(props) => props.theme.black};
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  h1 {
    font-size: 1.5rem;
    line-height: 1.6;
    text-align: center;
  }
  label {
    margin-left: 0.5rem;
    position: relative;
    display: inline-block;
    width: 3.75rem;
    height: 2rem;
    input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    span {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 34px;
      background-color: #ccc;
      -webkit-transition: 0.4s;
      transition: 0.4s;
      :before {
        border-radius: 50%;
        position: absolute;
        content: '';
        height: 1.5rem;
        width: 1.625rem;
        left: 0.25rem;
        bottom: 0.25rem;
        background-color: ${(props) => props.theme.white};
        -webkit-transition: 0.4s;
        transition: 0.4s;
      }
    }
    input:checked + span {
      background-color: ${(props) => props.theme['yellow-700']};
    }
    input:focus + span {
      box-shadow: 0 0 1px ${(props) => props.theme['yellow-700']};
    }
    input:checked + span:before {
      -webkit-transform: translateX(1.625rem);
      -ms-transform: translateX(1.625rem);
      transform: translateX(1.625rem);
    }
  }
`

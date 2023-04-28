import styled from 'styled-components'

export const PhotoListContainer = styled.div`
  margin-top: calc(65vh);
  margin-right: 8rem;
  bottom: 0;
  background-color: ${(props) => props.theme['white']};
  z-index: 9999;
  height: 25vh;
  max-width: 60vw;
  overflow-x: scroll;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0px 4px 4px ${(props) => props.theme['black']};
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1{
    font-size: 0.85rem;
    line-height: 1;
    text-align: center;
    padding-bottom: 0.375rem;
  }
  p{
    font-size: 0.75rem;
    line-height: 1.6;
    text-align: center;
  }
  svg{
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme['yellow-700']};
    }
  }
`
export const CardPhoto = styled.div`
  cursor: pointer;
  padding: 0.25rem;
  background: white;
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
  height:calc(25vh - 1rem - 0.5rem);
  width: 30vw;
  align-items: center;
  h2 {
    font-size: 0.875rem;
    font-weight: bold;
    margin: 0;
    text-align: center;
  }
  p {
    font-size: 0.75rem;
    opacity: .7;
    margin: 0;
    svg{
      font-size: 1rem;
    }
  }
`

export const CardPhotoActive = styled.div`
  cursor: pointer;
  padding: 0.25rem;
  background: white;
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
  height:calc(25vh - 1rem - 0.5rem);
  width: 30vw;
  align-items: center;
  background-color: ${(props) => props.theme['yellow-400']};
`

export const CardImage = styled.div`
  display: flex;
  justify-content: center;
  height: 70%;
  overflow: hidden;
  img {
    width: 100%;
    object-fit: cover;
    height: auto;
  }
`

export const CardDiscription = styled.div`
  padding: 0.5rem;
  height: 30%;
  position: relative;
  vertical-align: middle;
  h2 {
    font-size: 0.875rem;
    font-weight: bold;
    margin: 0;
    text-align: center;
  }

  p {
    font-size: 0.75rem;
    opacity: .7;
    margin: 0;
    svg{
      font-size: 1rem;
    }
  }
`

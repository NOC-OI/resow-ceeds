import styled from 'styled-components'

export const LayerSelectionContainer = styled.div`
  z-index: 9998;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom-left-radius: 16px;
  padding-bottom: 0.75rem;
  color: ${(props) => props.theme.white};
`

export const LayerSelectionTitle = styled.div`
  width: 100%;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  padding: 0.5rem;
  margin: 0;
  text-align: center;
  h1 {
    font-size: 1rem;
    font-weight: bold;
    /* text-transform: capitalize; */
  }
`

export const LayerTypes = styled.div`
  max-height: calc(80vh - 3rem + 0.75rem);
  overflow-y: auto;
`

export const WithAreaLayerTypes = styled.div`
  max-height: calc(
    90vh - 2.5rem - 0.75rem - 1rem - 2rem - 0.75rem - 1.375rem - 0.5rem - 2rem -
      3.55rem
  );
  overflow-y: auto;
`

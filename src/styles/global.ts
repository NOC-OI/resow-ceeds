import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`

  @media (min-width: 100px){
    html{
      font-size: 70%;
    }
  }
  
  @media (min-width: 640px){
    html{
      font-size: 75%;
    }
  }
  @media (min-width: 768px){
    html{
      font-size: 80%;
    }
  }
  @media (min-width: 1024px){
    html{
      font-size: 85%;
    }
  }
  @media (min-width: 1280px){
    html{
      font-size: 90%;
    }
  }
  @media (min-width: 1536px){
    html{
      font-size: 95%;
    }
  }
  @media (min-width: 1700px){
    html{
      font-size: 100%;
    }
  }
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  * {
    margin: 0;
    padding: 0;
    box-sizing: border -box;
  }

  body{
    height: 100vh;
    width: 100vw;
    overflow-y: hidden;
    overflow-x: hidden;
    color: ${(props) => props.theme.black};
    -webkit-font-smoothing: antialiased;
  }

  body, input, textarea, button{
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    /* font-size: 1rem; */
  }

`

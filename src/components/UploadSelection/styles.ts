import { TextField } from '@mui/material'
import styled from 'styled-components'

export const ButtonIcon = styled.div`
  /* background-color: ${(props) => props.theme.white}; */
  --tw-bg-opacity: 0.7;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`

export const CssTextField = styled(TextField)({
  '& label': {
    color: 'red',
  },
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'yellow',
  },
  '& .MuiInputBase-root.MuiInput-root:before': {
    borderBottom: '1px solid white',
  },
})

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InfoButtonBoxContainer } from "./styles";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface InfoButtonBoxProps {
  infoButtonBox: any,
  setInfoButtonBox: any,
}


export function InfoButtonBox({infoButtonBox, setInfoButtonBox}: InfoButtonBoxProps) {

  function handleClose(){
    setInfoButtonBox({})
  }

  return (
    <InfoButtonBoxContainer>
      <div>
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      <h1>{infoButtonBox.title}</h1>
      <p>{infoButtonBox.content}</p>
    </InfoButtonBoxContainer>
  )
}

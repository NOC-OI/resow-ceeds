import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CalculationValueContainer } from "./styles";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface CalculationValueProps {
  calculationValue: any,
  setCalculationValue: any,
}


export function CalculationValue({calculationValue, setCalculationValue}: CalculationValueProps) {

  let param
  let results: string[][][]

  if (!calculationValue){
    param = '---'
    results = [[['---']]]
  } else{
    param = Object.keys(calculationValue[Object.keys(calculationValue)[0]])
    results = Object.values(calculationValue[Object.keys(calculationValue)[0]])
  }
  function handleClose(){
    setCalculationValue('')
  }

  return (
    <CalculationValueContainer>
      <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      <h1>{Object.keys(calculationValue)[0]}</h1>
      {results.map(result => {
        let elements = Object.values(result)[0]
        console.log(elements)
        return (
          elements.map(element =>{
            console.log(element)
            return (
              <p key={element}>{element}</p>
            )
          })
        )
      })}
      {/* <span>{result}</span> */}
    </CalculationValueContainer>
  )
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CalculationValueContainer } from "./styles";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface CalculationValueProps {
  calculationValue: any,
  setCalculationValue: any,
}


export function CalculationValue({calculationValue, setCalculationValue}: CalculationValueProps) {

  function handleClose(){
    setCalculationValue('')
  }

  return (
    <CalculationValueContainer>
      <div>
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      {Object.keys(calculationValue[Object.keys(calculationValue)[0]]).map((column: any, idx: any) => {
        let newObject = calculationValue[Object.keys(calculationValue)[0]][column]
        return (
          Object.keys(newObject).map((calc: any, ii: any) => {
            let newObject2 = newObject[calc]
            return (
              newObject2.map((result: any, i: any) => {
                if(i === 0){
                  if (ii === 0){
                    if(idx === 0){
                      return (
                        <div key={`${column}_${calc}_${result}`}>
                          <h1>{column}</h1>
                          <h2>{calc}</h2>
                          <p>{result}</p>
                        </div>
                      )
                    } else{
                      return (
                        <div key={`${calc}_${result}`}>
                          <h2>{calc}</h2>
                          <p>{result}</p>
                        </div>
                      )
                    }
                  } else{
                    return (
                      <div key={`${result}`}>
                        <h2>{calc}</h2>
                        <p>{result}</p>
                      </div>
                    )
                  }
                } else{
                  return (
                    <div key={`${result}_1`}>
                      <p>{result}</p>
                    </div>
                  )
                }
              })
            )
          })
        )
      })}
    </CalculationValueContainer>
  )
}

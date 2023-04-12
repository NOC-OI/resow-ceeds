import { CalcType } from "../CalcType";
import { CalcSelectionContainer, CalcSelectionTitle, CalcTypes } from "./styles";
import { useState } from "react";

interface CalcSelectionProps{
  setCalculationValue: any
}

export function CalcSelection({setCalculationValue}: CalcSelectionProps) {

  const [calcClasses, setCalcClasses] = useState([{
    calcClass: 'Biozones',
    calcNames: {
      calc1: {
        name: 'Number of Biozones',
        url: '/data?filename=clipped_haigfras_biozones&calc=count',
      },
      calc2: {
        name: 'Names of Biozones',
        url: '/data?filename=clipped_haigfras_biozones&calc=unique',
      },
    }
  }]);

  return (
    <CalcSelectionContainer>
      <CalcSelectionTitle>
        <h1>Use Cases</h1>
      </CalcSelectionTitle>
      <CalcTypes>
        {calcClasses.map(calcClass => {
          return (
            <CalcType
              key={calcClass.calcClass}
              content={calcClass.calcClass}
              childs={calcClass.calcNames}
              setCalculationValue={setCalculationValue}
            />
          )
        })}
      </CalcTypes>
    </CalcSelectionContainer>
  )
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CalcType } from "../CalcType";
import { listCalcs } from "./listCalc";
import { ActiveButton, Button, CalcSelectionArea, CalcSelectionContainer, CalcSelectionTitle, CalcTypes, CalcTypesWithoutTitle } from "./styles";
import { useState } from "react";
import { faGlobe, faObjectUngroup } from "@fortawesome/free-solid-svg-icons";

interface CalcSelectionProps{
  setCalculationValue: any,
  selectedArea: boolean,
  setSelectedArea: any
}

export function CalcSelection({setCalculationValue, selectedArea, setSelectedArea}: CalcSelectionProps) {

  const [calcClasses, setCalcClasses] = useState(listCalcs);

  function handleWorldClick() {
    setSelectedArea(false)
  }
  function handleMapSelectClick() {
    setSelectedArea(true)
  }

  return (
    <CalcSelectionContainer>
      <CalcSelectionTitle>
        <h1>Use Cases</h1>
      </CalcSelectionTitle>
      <CalcSelectionArea>
        <h1>SELECT AREA</h1>
        {!selectedArea?
          <div>
            <ActiveButton>
              <FontAwesomeIcon onClick={handleWorldClick}  title="All the World" icon={faGlobe} />
            </ActiveButton>
            <Button>
              <FontAwesomeIcon onClick={handleMapSelectClick} title="Draw a polygon on the map" icon={faObjectUngroup} />
            </Button>
          </div>
          :
          <div>
            <Button>
              <FontAwesomeIcon onClick={handleWorldClick}  title="All the World" icon={faGlobe} />
            </Button>
            <ActiveButton>
              <FontAwesomeIcon onClick={handleMapSelectClick} title="Draw a polygon on the map" icon={faObjectUngroup} />
            </ActiveButton>
          </div>
        }
      </CalcSelectionArea>
      <CalcTypes>
        <h1>SELECT USE CASE</h1>
        <CalcTypesWithoutTitle>
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
        </CalcTypesWithoutTitle>
      </CalcTypes>
    </CalcSelectionContainer>
  )
}

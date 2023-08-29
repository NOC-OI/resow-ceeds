import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { InfoButtonBoxContainer } from '../DynamicGraphBox/styles'
import { TableContainer } from './styles'
import { CalculateStatT } from './calculateStatT'

interface DynamicTableBoxProps {
  dynamicTableData: any
  setDynamicTableData: any
}

// interface keyable {
//   [key: string]: any
// }

export function DynamicTableBox({
  dynamicTableData,
  setDynamicTableData,
}: DynamicTableBoxProps) {
  function handleClose() {
    setDynamicTableData(null)
  }

  // const [nValue, setNValue] = useState(0)
  const [deltaValue, setDeltaValue] = useState(0)
  const [pValue, setPValue] = useState(0)
  const [coefVarValue, setCoefVarValue] = useState(0)
  const [aValue, setAValue] = useState(0)
  const [calculationResults, setCalculationResults] = useState(null)

  const maxN = 30
  const nValues = Array.from({ length: maxN }, (x, i) => i)
  const deltaValues = [10, 14, 20, 28, 40, 56, 79, 112, 158, 224]
  const pValues = [0.01, 0.05, 0.1]
  const coefVarValues = Array.from({ length: 10 }, (x, i) => (i + 1) * 5)
  const aValues = Array.from({ length: 10 }, (x, i) => i + 1)

  // const coefVarValues = [5]
  // const nValues = [4]
  // const pValues = [0.05]
  // const deltaValues = [14]
  // const aValues = [2]

  useEffect(() => {
    const calculateStatT = new CalculateStatT(
      nValues,
      deltaValues,
      pValues,
      pValue,
      coefVarValues,
      aValues,
      aValue,
      maxN,
    )

    setCalculationResults(calculateStatT.calculateStat())
    console.log(calculateStatT.results)
  }, [pValue, aValue])

  // console.log(calculationResults)
  return (
    <InfoButtonBoxContainer id="dynamic-graph">
      <div className="flex justify-end pb-3">
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      <p className="font-bold text-center pb-3 text-lg">
        {dynamicTableData.name}
      </p>
      <div className="w-full pb-2 gap-2" id="select-survey-values">
        {/* <label className="flex w-full" htmlFor={'N'}>
          <p className="pr-4 w-20">N</p>
          <input
            type="range"
            className="flex-grow"
            step={1}
            min={0}
            max={nValues.length - 1}
            name={'N'}
            value={nValue}
            onChange={(e) => setNValue(parseInt(e.currentTarget.value))}
          />
          <p className="pl-4 w-10">{nValues[nValue]}</p>
        </label> */}
        <label className="p-4 w-full" htmlFor={'NUMBER OF STRATA'}>
          <p className="text-center w-full pb-2">
            <strong>Number of Strata:</strong> {aValues[aValue]}
          </p>
          <input
            type="range"
            className="w-full"
            step={1}
            min={0}
            max={aValues.length - 1}
            name={'NUMBER OF STRATA'}
            value={aValue}
            onChange={(e) => setAValue(parseInt(e.currentTarget.value))}
          />
        </label>
        <label className="p-4 w-full" htmlFor={'P'}>
          <p className="text-center w-full pb-2">
            <strong>Power of the Test:</strong> {pValues[pValue]}
          </p>
          <input
            type="range"
            className="w-full"
            step={1}
            min={0}
            max={pValues.length - 1}
            name={'P'}
            value={pValue}
            onChange={(e) => setPValue(parseInt(e.currentTarget.value))}
          />
        </label>
        <label className="w-full p-4" htmlFor={'DELTA'}>
          <p className="text-center w-full pb-2">
            <strong>Smallest True Difference to Detect:</strong>{' '}
            {deltaValues[deltaValue]}
          </p>
          <input
            type="range"
            className="w-full"
            step={1}
            min={0}
            max={deltaValues.length - 1}
            name={'DELTA'}
            value={deltaValue}
            onChange={(e) => {
              return setDeltaValue(parseInt(e.currentTarget.value))
            }}
          />
        </label>
        <label className="p-4 w-full" htmlFor={'COEF VAR'}>
          <p className="text-center w-full pb-2">
            <strong>Coeficient of Variation:</strong>{' '}
            {coefVarValues[coefVarValue]}
          </p>
          <input
            type="range"
            className="w-full"
            step={1}
            min={0}
            max={coefVarValues.length - 1}
            name={'COEF VAR'}
            value={coefVarValue}
            onChange={(e) => setCoefVarValue(parseInt(e.currentTarget.value))}
          />
        </label>
      </div>
      <div>
        <p className="text-center w-full pt-5 pb-3 italic">
          Smallest True Difference to Detect
        </p>
        {calculationResults && (
          <div>
            <div className="flex pr-4 pl-4">
              <p className="table-yaxis text-center pl-3 italic">
                Coeficient of Variation
              </p>
              <TableContainer>
                <thead>
                  <tr>
                    <th></th>
                    {deltaValues.map((valueDelta) => {
                      return <th>{valueDelta}</th>
                    })}
                  </tr>
                </thead>
                <tbody className="table-hover">
                  {coefVarValues.map((valueCoefVar, idxRow) => {
                    return (
                      <tr>
                        <td>{valueCoefVar}</td>
                        {calculationResults[idxRow].map((result, idxCol) => {
                          let backgroundColor =
                            result === `>${maxN}` ? 'red' : '#ffffff'
                          backgroundColor =
                            idxRow === coefVarValue && idxCol === deltaValue
                              ? 'blue'
                              : backgroundColor
                          let color = '#666b85'
                          if (backgroundColor !== '#ffffff') {
                            color = '#ffffff'
                          }
                          return (
                            <td style={{ backgroundColor, color }}>{result}</td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </TableContainer>
            </div>
            <p className="text-center text-2xl pt-5 pb-3 font-bold">
              Number of samples required:{' '}
              {calculationResults[coefVarValue][deltaValue]}
            </p>
          </div>
        )}
      </div>
    </InfoButtonBoxContainer>
  )
}

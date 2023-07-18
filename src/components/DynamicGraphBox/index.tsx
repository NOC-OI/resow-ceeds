import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InfoButtonBoxContainer, RangeArea, RangeValue } from './styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useMemo, useState } from 'react'
import Plot from 'react-plotly.js'

interface DynamicGraphBoxProps {
  dynamicGraphData: any
  setDynamicGraphData: any
  surveyDesignCircleValues: any
  setSurveyDesignCircleValues: any
  fileSurveyDesign: any
  setFileSurveyDesign: any
}

// interface keyable {
//   [key: string]: any
// }

export function DynamicGraphBox({
  dynamicGraphData,
  setDynamicGraphData,
  surveyDesignCircleValues,
  setSurveyDesignCircleValues,
  fileSurveyDesign,
  setFileSurveyDesign,
}: DynamicGraphBoxProps) {
  const [column, setColumn] = useState(
    dynamicGraphData.name.biodiversity
      ? dynamicGraphData.name.biodiversity[
          Object.keys(dynamicGraphData.name.biodiversity)[0]
        ]
      : 'Density',
  )

  const [hoverValue, setHoverValue] = useState(['--', '--'])
  function handleChangeFile(e: any) {
    setFileSurveyDesign(e.target.value)
  }
  function handleChangeColumn(e: any) {
    setColumn(e.target.value)
  }

  function handleClose() {
    setDynamicGraphData(null)
    setSurveyDesignCircleValues([])
  }

  function getCircleLimits(areas: any) {
    const radius = [
      Math.sqrt(areas[0] / Math.PI),
      Math.sqrt(areas[1] / Math.PI),
    ]
    setSurveyDesignCircleValues(radius)
  }

  function handleChangeSurveyDesignCircleValues(e: any) {
    if (e['xaxis.range']) {
      getCircleLimits(e['xaxis.range'])
    }
  }

  useEffect(() => {
    const minValue = Math.min(...dynamicGraphData.data['cum.Area_m2.mean'])
    const maxValue = Math.max(...dynamicGraphData.data['cum.Area_m2.mean'])
    getCircleLimits([minValue, maxValue])
  }, [])

  function showValue(e: any) {
    const newHoverValue = Math.log10(e.yvals[0]).toFixed(2)
    setHoverValue([
      e.xvals[0].toFixed(0),
      newHoverValue,
      Math.log10(
        dynamicGraphData.data[`cum.${column}.sd`][e.points[0].pointNumber],
      ).toFixed(2),
    ])
  }

  function generateStdData(
    stdColumn: string,
    meanColumn: string,
    operation: string,
  ) {
    if (operation === 'plus') {
      return dynamicGraphData.data[meanColumn].map(
        (value: number, idx: number) => {
          return value + dynamicGraphData.data[stdColumn][idx]
        },
      )
    } else {
      return dynamicGraphData.data[meanColumn].map(
        (value: number, idx: number) => {
          return value - dynamicGraphData.data[stdColumn][idx]
        },
      )
    }
  }

  const displayGraph = useMemo(
    () => (
      <Plot
        data={[
          {
            x: dynamicGraphData.data['cum.Area_m2.mean'],
            y: dynamicGraphData.data[`cum.${column}.mean`],
            mode: 'lines',
            marker: { color: 'red' },
            // hovertemplate: '<i>X</i>: %{x:.0f}' + '<br><b>Y</b>: %{y:.3f}<br>',
            hoverinfo: 'x+y',
          },
          {
            x: dynamicGraphData.data['cum.Area_m2.mean'],
            y: generateStdData(
              `cum.${column}.sd`,
              `cum.${column}.mean`,
              'plus',
            ),
            line: { width: 0 },
            marker: { color: '444' },
            mode: 'lines',
            type: 'scatter',
            hoverinfo: 'none',
          },
          {
            x: dynamicGraphData.data['cum.Area_m2.mean'],
            y: generateStdData(
              `cum.${column}.sd`,
              `cum.${column}.mean`,
              'minus',
            ),
            fill: 'tonexty',
            fillcolor: 'rgba(68, 68, 68, 0.3)',
            line: { width: 0 },
            mode: 'lines',
            type: 'scatter',
            hoverinfo: 'none',
          },
        ]}
        layout={{
          width: 300,
          height: 400,
          hovermode: 'closest',
          showlegend: false,
          // title: ,
          margin: { l: 50, r: 20, t: 20, b: 0 },
          xaxis: {
            rangeslider: {},
            hoverformat: '.0f',
            title: {
              // text: 'Seabed area (m2)',
              // font: {
              //   family: 'Courier New, monospace',
              //   size: 18,
              //   color: '#7f7f7f'
              // }
            },
          },
          yaxis: {
            autorange: true,
            fixedrange: false,
            hoverformat: '.0f',
            type: ['Density', 'Hill1', 'Hill2'].includes(column) ? '-' : 'log',
            title: {
              text:
                column === 'Density'
                  ? 'Density (counts/m2)'
                  : `${Object.keys(dynamicGraphData.name.biodiversity).find(
                      (key) =>
                        dynamicGraphData.name.biodiversity[key] === column,
                    )}`,
              // font: {
              //   family: 'Courier New, monospace',
              //   size: 18,
              //   color: '#7f7f7f'
              // }
            },
          },
        }}
        onRelayout={handleChangeSurveyDesignCircleValues}
        onHover={showValue}
        config={{ responsive: true, displayModeBar: false }}
      />
    ),
    [column],
  )

  return (
    <InfoButtonBoxContainer>
      <div className="flex justify-end pb-3">
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      <div className="font-bold text-center pb-3">
        {dynamicGraphData.name.name}
      </div>
      <div className="flex justify-around w-full pb-2 gap-2">
        <label className="w-70 text-sm" htmlFor={`select_habitat`}>
          Habitat type:
        </label>
        <select
          onChange={handleChangeFile}
          className="w-50"
          id={`select_habitat`}
          name={`select_habitat`}
          defaultValue={fileSurveyDesign}
        >
          {dynamicGraphData.name.habitat.map((value: string) => {
            return (
              <option key={value} value={value}>
                {value.toUpperCase()}
              </option>
            )
          })}
        </select>
      </div>
      {dynamicGraphData.name.biodiversity ? (
        <div className="flex justify-around w-full pt-2 gap-2">
          <label className="w-35 text-sm" htmlFor={`select_biodiversity`}>
            Biodiversity Calculation:
          </label>
          <select
            id={`select_biodiversity`}
            className="w-50"
            onChange={handleChangeColumn}
            name={`select_biodiversity`}
          >
            {Object.keys(dynamicGraphData.name.biodiversity).map(
              (value: string) => {
                return (
                  <option
                    key={value}
                    value={dynamicGraphData.name.biodiversity[value]}
                  >
                    {value}
                  </option>
                )
              },
            )}
          </select>
        </div>
      ) : null}
      {hoverValue[0] !== '--' ? (
        <div className="flex justify-center p-4">
          <RangeValue className="text-center text-sm">
            <p className="bg-blue-500">
              Seabed Area: {hoverValue[0]} m2 / Value: {hoverValue[1]} +-
              {hoverValue[2]}
            </p>
          </RangeValue>
        </div>
      ) : (
        <div className="flex justify-center p-8"></div>
      )}
      {displayGraph}
      <RangeArea>
        <div className="text-center text-sm pl-10">
          <p className="">|</p>
          <p className="">
            {Math.min(...dynamicGraphData.data['cum.Area_m2.mean']).toFixed(0)}
          </p>
        </div>
        <RangeValue className="text-center text-sm pl-10">
          <p className="bg-blue-500">
            {(
              surveyDesignCircleValues[0] *
              surveyDesignCircleValues[0] *
              Math.PI
            ).toFixed(0)}
          </p>
        </RangeValue>
        <RangeValue className="text-center text-sm pr-5">
          <p className="bg-red-500">
            {(
              surveyDesignCircleValues[1] *
              surveyDesignCircleValues[1] *
              Math.PI
            ).toFixed(0)}
          </p>{' '}
        </RangeValue>
        <div className="text-center text-sm pr-5">
          <p className="">|</p>
          <p className="">
            {Math.max(...dynamicGraphData.data['cum.Area_m2.mean']).toFixed(0)}
          </p>
        </div>
      </RangeArea>
      <p className="text-center p-4">Seabed area (m2)</p>
    </InfoButtonBoxContainer>
  )
}

// function mapPropsAreEqual(prevMap: any, nextMap: any) {
//   return (
//     prevMap.column === nextMap.column &&
//     prevMap.surveyDesignCircleValues === nextMap.surveyDesignCircleValues &&
//     prevMap.hoverValue === nextMap.hoverValue
//   )
// }

// export const DynamicGraphBox = React.memo(DynamicGraphBox1, mapPropsAreEqual)

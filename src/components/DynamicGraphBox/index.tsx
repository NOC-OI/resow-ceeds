import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InfoButtonBoxContainer } from './styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js';

interface DynamicGraphBoxProps {
  dynamicGraphData: any
  setDynamicGraphData: any
  surveyDesignCircleValues: any
  setSurveyDesignCircleValues: any
}


function DynamicGraphBox1({
  dynamicGraphData,
  setDynamicGraphData,
  surveyDesignCircleValues,
  setSurveyDesignCircleValues,
}: DynamicGraphBoxProps) {
  const [data, setData] = useState<any[]>([])
  const [waitState, setWaitState] = useState(false)

  function handleClose() {
    setDynamicGraphData(null)
    setSurveyDesignCircleValues([])
  }

  function getCircleLimits(areas: any){
    const radius =  [
      Math.sqrt(areas[0]/Math.PI),
      Math.sqrt(areas[1]/Math.PI)
    ]
    setSurveyDesignCircleValues(radius)
  }

  function handleChangeSurveyDesignCircleValues(e: any){
    if (e['xaxis.range']){
      getCircleLimits(e['xaxis.range'])
    }
  }

  useEffect(() => {
    const minValue = Math.min(...dynamicGraphData['cum.Area_m2.mean'])
    const maxValue = Math.max(...dynamicGraphData['cum.Area_m2.mean'])
    console.log([minValue, maxValue])
    getCircleLimits([minValue, maxValue])
  }, [])

  return (
    <InfoButtonBoxContainer>
      <div>
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      <div className="font-bold text-center pb-3">Graph</div>
        <Plot
          data={[
            {
              x: dynamicGraphData['cum.Area_m2.mean'],
              y: dynamicGraphData['cum.Density.mean'],
              mode: 'lines',
              marker: {color: 'red'},
            },
          ]}
          layout = {{
            width: 300,
            height: 400,
            // title: 'Time series with range slider and selectors',
            margin: { l: 20, r: 20, t: 20, b: 20 },
            xaxis: {
              rangeslider: {}
            },
            yaxis: {
              fixedrange: true
            }
          }}
          onRelayout={handleChangeSurveyDesignCircleValues}
          config={{ responsive: true, displayModeBar: false }}
        />
    </InfoButtonBoxContainer>
  )
}

function mapPropsAreEqual(prevMap: any, nextMap: any) {
  return ( true
  )
}

export const DynamicGraphBox = React.memo(DynamicGraphBox1, mapPropsAreEqual)

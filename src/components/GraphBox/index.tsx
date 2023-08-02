import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InfoButtonBoxContainer } from './styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from 'victory'
import { GetTitilerData } from './getTitilerData'
import { Loading } from '../Loading'

interface GraphBoxProps {
  graphData: any
  setGraphData: any
  actualLayer: any
  setGetPolyline: any
}

// interface keyable {
//   [key: string]: any
// }

export function GraphBox({
  graphData,
  setGraphData,
  actualLayer,
  setGetPolyline,
}: GraphBoxProps) {
  const [data, setData] = useState<any[]>([])

  const [waitState, setWaitState] = useState(false)
  function handleClose() {
    setGetPolyline(false)
    setGraphData(null)
  }

  useEffect(() => {
    setTimeout(() => {
      setWaitState(true)
    }, 5000)
  }, [])

  useEffect(() => {
    const getTitilerData = new GetTitilerData(graphData, actualLayer[0])
    getTitilerData.fetchData().then(async function () {
      setData(getTitilerData.dataGraph)
    })
  }, [])
  return (
    <InfoButtonBoxContainer id="graph-box">
      <div>
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      <div className="font-bold text-center pb-3">Graph</div>

      {!waitState ? (
        <div>
          <p>Generating graph...</p>
          <Loading />
        </div>
      ) : (
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: 'gray', fill: 'gray' },
              axisLabel: {
                fontSize: 15,
                padding: 30,
              },
              grid: {
                stroke: ({ tick }: any) => (tick > 0.5 ? 'gray' : 'gray'),
              },
              ticks: { stroke: 'gray', size: 5 },
              tickLabels: {
                fontSize: 15,
                padding: 5,
                color: 'gray',
                fill: 'gray',
              },
            }}
          />
          <VictoryAxis
            label="Distance (km)"
            style={{
              axis: { stroke: 'gray', fill: 'gray' },
              axisLabel: {
                fontSize: 15,
                padding: 30,
              },
              grid: {
                stroke: ({ tick }: any) => (tick > 0.5 ? 'gray' : 'gray'),
              },
              ticks: { stroke: 'gray', size: 5 },
              tickLabels: {
                fontSize: 15,
                padding: 5,
                color: 'gray',
                fill: 'gray',
              },
            }}
          />
          <VictoryLine
            style={{
              data: { stroke: '#c43a31' },
              parent: { border: '1px solid #ccc' },
            }}
            data={data}
          />
        </VictoryChart>
      )}
    </InfoButtonBoxContainer>
  )
}

/* <Plot
          data={[
            {
              x: data.distance,
              y: data.value,
              type: 'scatter',
              mode: 'markers',
              marker: { color: 'red' },
            },
          ]}
          layout={{
            width: 320,
            height: 300,
            margin: { l: 20, r: 20, t: 20, b: 20 },
          }}
          config={{ responsive: true, displayModeBar: false }}
        /> */

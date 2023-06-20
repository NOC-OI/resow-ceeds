import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InfoButtonBoxContainer } from './styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import { Loading } from '../Loading'
import { GetTitilerData } from './getTitilerData'

interface GraphBoxProps {
  graphData: any
  setGraphData: any
  actualLayer: any
  setGetPolyline: any
}

interface keyable {
  [key: string]: any
}

export function GraphBox({
  graphData,
  setGraphData,
  actualLayer,
  setGetPolyline,
}: GraphBoxProps) {
  const [data, setData] = useState<keyable>({})

  const [loading, setLoading] = useState<boolean>(true)

  function handleClose() {
    setGetPolyline(false)
    setGraphData(null)
  }

  useEffect(() => {
    const getTitilerData = new GetTitilerData(graphData, actualLayer[0])
    getTitilerData.fetchData().then(async function () {
      setData(getTitilerData.dataGraph)
      setLoading(false)
    })
  }, [])

  return (
    <InfoButtonBoxContainer>
      <div>
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      <div className="font-bold text-center pb-3">Graph</div>
      {loading ? (
        <Loading />
      ) : (
        <Plot
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
        />
      )}
    </InfoButtonBoxContainer>
  )
}

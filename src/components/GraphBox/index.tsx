import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  InfoButtonBoxContainer,
  InfoButtonBoxContent,
} from '../InfoButtonBox/styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { GetTitilerData } from '../../lib/map/getTitilerData'
import Plot from 'react-plotly.js'
import Draggable from 'react-draggable'
import { yearMonths } from '../../data/yearMonths'
import { GetGeoblazeValuePoint } from '../../lib/map/getGeoblazeValue'
import { useContextHandle } from '../../lib/contextHandle'

interface GraphBoxProps {
  graphData: any
  setGraphData: any
  actualLayer: any
  setGetPolyline: any
  setClickPoint: any
  selectedLayers: any
}

export function GraphBox({
  graphData,
  setGraphData,
  actualLayer,
  setGetPolyline,
  setClickPoint,
  selectedLayers,
}: GraphBoxProps) {
  const [data, setData] = useState<any>(null)
  const { setLoading } = useContextHandle()

  function handleClose() {
    setGetPolyline(false)
    setClickPoint(false)
    setGraphData(null)
  }

  useEffect(() => {
    setLoading(true)
    async function fetchData() {
      if (graphData.length === 1) {
        const getGeoblazeValue = new GetGeoblazeValuePoint(
          graphData,
          actualLayer[0],
          yearMonths,
        )
        await getGeoblazeValue.getGeoblaze()
        setData(getGeoblazeValue.dataGraph)
      } else {
        const getTitilerData = new GetTitilerData(graphData, actualLayer[0])
        getTitilerData.fetchData().then(async function () {
          setData(getTitilerData.dataGraph)
        })
      }
    }
    Object.keys(selectedLayers).forEach((key) => {
      if (selectedLayers[key].url === actualLayer[0]) {
        setLayer({ layerName: key, layerInfo: selectedLayers[key] })
      }
    })
    try {
      fetchData()
    } catch (error) {
      console.log('Error fetching data: ', error)
    }
    setLoading(false)
  }, [])

  const [layer, setLayer] = useState<any>({})

  const nodeRef = useRef(null)
  const [yearStart, monthStart] = yearMonths[0].split('-')
  const [yearEnd, monthEnd] = yearMonths[yearMonths.length - 1].split('-')

  return (
    <Draggable nodeRef={nodeRef} cancel=".clickable">
      <InfoButtonBoxContainer
        ref={nodeRef}
        id="graph-box"
        className="min-h-[20rem] min-w-[15rem]"
      >
        <div>
          <FontAwesomeIcon
            icon={faCircleXmark}
            onClick={handleClose}
            className="clickable"
          />
        </div>
        <div className="font-bold text-center pb-3">
          {Object.keys(layer).length > 0
            ? layer.layerName.replace('_', ': ')
            : 'Graph'}
        </div>
        <InfoButtonBoxContent>
          {!data ? (
            <div>
              <p className="!text-center !justify-center">
                Generating graph...
              </p>
            </div>
          ) : (
            <Plot
              data={[
                {
                  x: data.distance ? data.distance : data.time,
                  y: data.value,
                  mode: 'lines',
                  marker: { color: 'red' },
                  // hovertemplate: '<i>X</i>: %{x:.0f}' + '<br><b>Y</b>: %{y:.3f}<br>',
                  hoverinfo: 'x+y',
                },
              ]}
              layout={{
                width: 300,
                height: 400,
                hovermode: 'closest',
                showlegend: false,
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                // title: ,
                margin: { l: 50, r: 20, t: 20, b: 50 },
                xaxis: {
                  hoverformat: '.0f',
                  title: {
                    text: data.distance ? 'Distance (km)' : 'Time (months)',
                    font: {
                      color: 'white', // Set the x-axis title color to white
                    },
                  },
                  tickfont: {
                    color: 'white', // Set the x-axis tick labels color to white
                  },
                  range: data.distance
                    ? [Math.min(...data.distance), Math.max(...data.distance)]
                    : [
                        new Date(parseInt(yearStart), parseInt(monthStart), 1),
                        new Date(parseInt(yearEnd), parseInt(monthEnd), 1),
                      ],
                  gridcolor: 'white', // Set the x-axis grid line color to white
                },
                yaxis: {
                  autorange: true,
                  fixedrange: false,
                  hoverformat: '.0f',
                  title: {
                    text: `${layer.layerInfo.dataDescription[0]} ${layer.layerInfo.dataDescription[1]}`,
                    font: {
                      color: 'white', // Set the y-axis title color to white
                    },
                  },
                  tickfont: {
                    color: 'white', // Set the y-axis tick labels color to white
                  },
                  gridcolor: 'white', // Set the y-axis grid line color to white
                },
              }}
              config={{ responsive: true, displayModeBar: false }}
            />
          )}
        </InfoButtonBoxContent>
      </InfoButtonBoxContainer>
    </Draggable>
  )
}

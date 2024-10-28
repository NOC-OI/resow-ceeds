import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  InfoButtonBoxContainer,
  InfoButtonBoxContent,
} from '../InfoButtonBox/styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { GetHorizontalData } from '../../lib/map/getHorizontalData'
import Plot from 'react-plotly.js'
import Draggable from 'react-draggable'
import { yearMonths } from '../../data/yearMonths'
// import { GetGeoblazeValuePoint } from '../../lib/map/getGeoblazeValue'
import { useContextHandle } from '../../lib/contextHandle'
import { CssTextField } from '../DownloadSelection/styles'
import { Button } from '@mui/material'
import { useDownloadManagementHandle } from '../../lib/data/downloadManagement'

interface GraphBoxProps {
  graphColumn: any
  graphColumns: any
  setGraphColumns: any
  graphLimits: any
  selectedLayers: any
  selectedSidebarOption: any
  setGraphLimits: any
}

export function GraphBox({
  graphColumn,
  graphColumns,
  setGraphColumns,
  graphLimits,
  selectedLayers,
  selectedSidebarOption,
  setGraphLimits,
}: GraphBoxProps) {
  const [data, setData] = useState<any>(null)
  const [layer, setLayer] = useState<any>({})
  const { setLoading } = useContextHandle()
  const { setFlashMessage } = useContextHandle()

  const { downloadableLayers } = useDownloadManagementHandle()
  const [numberOfBins, setNumberOfBins] = useState(20)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [columns, setColumns] = useState([])

  function handleClose() {
    if (
      selectedSidebarOption === 'data_exploration' &&
      Object.keys(graphColumns).length === 1
    ) {
      setGraphColumns({})
      setGraphLimits(null)
    } else {
      setGraphColumns((graphColumns: any) => {
        const copy = { ...graphColumns }
        delete copy[graphColumn]
        return copy
      })
    }
  }
  async function fetchData() {
    const getHorizontalData = new GetHorizontalData(
      graphLimits,
      graphColumn,
      graphColumns[graphColumn],
      numberOfBins,
      selectedColumn,
      downloadableLayers,
    )
    if (graphColumns[graphColumn].dataType === 'COG') {
      getHorizontalData.fetchTitilerData().then(async function () {
        setData(getHorizontalData.dataGraph)
      })
    } else if (graphColumns[graphColumn].dataType === 'GeoTIFF') {
      getHorizontalData.fetchGeoTiffData().then(async function () {
        setData(getHorizontalData.dataGraph)
      })
    } else if (graphColumns[graphColumn].dataType === 'WMS') {
      if (!data) {
        getHorizontalData.fetchWMSData().then(async function () {
          if (getHorizontalData.columns.length > 0) {
            setData(getHorizontalData.dataGraph)
            setColumns(getHorizontalData.columns)
            setSelectedColumn(getHorizontalData.columns[0])
          }
        })
      } else {
        setData(getHorizontalData.dataGraph)
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    Object.keys(selectedLayers).forEach((key) => {
      if (key.split('_')[1] === graphColumn) {
        setLayer({ layerName: key, layerInfo: selectedLayers[key] })
      }
    })
    try {
      fetchData()
    } catch (error) {
      setFlashMessage({
        messageType: 'error',
        content: 'Error fetching data. Please try again',
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    setLoading(true)
    try {
      fetchData()
    } catch (error) {
      setFlashMessage({
        messageType: 'error',
        content: 'Error fetching data. Please try again',
      })
    }
    setLoading(false)
  }, [graphLimits])

  const updateNumberOfBins = (value: any) => {
    if (value !== '') {
      setNumberOfBins(parseInt(value))
    } else {
      setNumberOfBins(0)
    }
  }
  const updateGraphData = async () => {
    if (numberOfBins > 1) {
      setLoading(true)
      if (numberOfBins > 50) {
        setFlashMessage({
          messageType: 'warning',
          content:
            'You are trying to plot too many bins. This may take a while',
        })
      }
      setData(null)
      await fetchData()
      setLoading(false)
    } else {
      setFlashMessage({
        messageType: 'error',
        content: 'Number of bins must be greater than 1',
      })
    }
  }

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
          {!data || !layer || Object.keys(layer).length === 0 ? (
            <div>
              <p className="!text-center !justify-center">
                Generating graph...
              </p>
            </div>
          ) : (
            <div className="!block">
              <div className="flex justify-center my-2">
                {selectedColumn && (
                  <select
                    id="graphColumn-select"
                    value={columns}
                    onChange={setSelectedColumn}
                    className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-max p-2 hover:bg-opacity-80"
                  >
                    {columns.map((column: any, index: any) => (
                      <option
                        className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                        value={column}
                        key={index}
                      >
                        {column}
                      </option>
                    ))}
                  </select>
                )}
                <CssTextField
                  id="number-of-bins"
                  label="Number of bins"
                  type="number"
                  name="num-bins"
                  variant="standard"
                  value={numberOfBins}
                  className="clickable !p-0"
                  InputLabelProps={{
                    style: {
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      width: '',
                      color: 'white',
                      borderWidth: '1px',
                      borderColor: 'white !important',
                    },
                  }}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateNumberOfBins(e.target.value)
                  }
                  InputProps={{
                    style: {
                      color: 'white',
                    },
                  }}
                />
                <Button
                  onClick={() => updateGraphData()}
                  variant="contained"
                  className=" !text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70 !ml-2 !p-0"
                >
                  Update
                </Button>
              </div>
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
                          new Date(
                            parseInt(yearStart),
                            parseInt(monthStart),
                            1,
                          ),
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
              <div className="text-right italic">
                <p className="text-xs text-white">
                  <strong>START POINT</strong> LAT:{' '}
                  {graphLimits.getLatLngs()[0].lat.toFixed(4)}°, LON:{' '}
                  {graphLimits.getLatLngs()[0].lng.toFixed(4)}°
                </p>
                <p className="text-xs text-white">
                  <strong>END POINT</strong> LAT:{' '}
                  {graphLimits.getLatLngs()[1].lat.toFixed(4)}°, LON:{' '}
                  {graphLimits.getLatLngs()[1].lng.toFixed(4)}°
                </p>
              </div>
            </div>
          )}
        </InfoButtonBoxContent>
      </InfoButtonBoxContainer>
    </Draggable>
  )
}

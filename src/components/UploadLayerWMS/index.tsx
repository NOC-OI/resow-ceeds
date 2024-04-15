import React, { useState } from 'react'
import { CssTextField } from '../DownloadSelection/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import styles from './UploadLayerWMS.module.css'

interface UploadLayerWMSProps {
  localUploadInfo: any
  setLocalUploadInfo: any
  selectedStyle: any
  setSelectedStyle: any
  layers: any
  setLayers: any
  wmsSelectedLayer: any
  setWmsSelectedLayer: any
  setError: any
}

export function UploadLayerWMS({
  localUploadInfo,
  setLocalUploadInfo,
  selectedStyle,
  setSelectedStyle,
  layers,
  setLayers,
  wmsSelectedLayer,
  setWmsSelectedLayer,
  setError,
}: UploadLayerWMSProps) {
  const [isLoading, setIsLoading] = useState(false)

  function parseCapabilities(xml) {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, 'text/xml')
    const layers = {}
    const layerNodes = xmlDoc.getElementsByTagName('Layer')
    for (let i = 0; i < layerNodes.length; i++) {
      const styles = []
      const layerNode = layerNodes[i]
      const layerName = layerNode.getElementsByTagName('Name')[0].textContent
      const styleNodes = layerNode.getElementsByTagName('Style')
      for (let j = 0; j < styleNodes.length; j++) {
        const styleNode = styleNodes[j]
        const styleName = styleNode.getElementsByTagName('Name')[0].textContent
        styles.push(styleName)
      }
      layers[layerName] = styles
    }
    return layers
  }
  // Function to fetch WMS capabilities
  const fetchCapabilities = async () => {
    setIsLoading(true)
    if (!localUploadInfo.url) {
      setError('Please fill the URL field')
      return
    }
    try {
      const response = await fetch(
        `${localUploadInfo.url}?service=WMS&request=GetCapabilities`,
      )
      const text = await response.text()
      const layers = parseCapabilities(text)
      setLayers(layers)
      setWmsSelectedLayer(Object.keys(layers)[0])
      setSelectedStyle(layers[Object.keys(layers)[0]][0])
    } catch (error) {
      setError(
        'Error fetching capabilities: please check the URL and try again',
      )
    }
    setIsLoading(false)
  }

  function handleChangeWmsSelectedLayer(value) {
    setWmsSelectedLayer(value)
    setSelectedStyle(layers[value][0])
  }
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex justify-center w-full items-center gap-2">
        <CssTextField
          id="wms-url"
          label="Url"
          type="text"
          name="url-wms"
          variant="standard"
          className="!w-full"
          InputLabelProps={{
            style: {
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              width: '100%',
              color: 'white',
              borderWidth: '10px',
              borderColor: 'white !important',
            },
          }}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLocalUploadInfo({ url: e.target.value })
          }
          InputProps={{
            style: {
              color: 'white',
            },
          }}
        />
        <div
          onClick={() => fetchCapabilities()}
          className="!text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70 p-2 cursor-pointer"
          title="See available layers"
        >
          <FontAwesomeIcon
            icon={faRotateRight}
            className={isLoading ? `${styles.rotate}` : ''}
          />
        </div>
      </div>
      {Object.keys(layers).length > 0 && (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="flex justify-between items-center w-full">
            <select
              id="fileFormat-select"
              value={wmsSelectedLayer}
              onChange={(e) => handleChangeWmsSelectedLayer(e.target.value)}
              className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-full p-2 hover:bg-opacity-80"
            >
              {Object.keys(layers).map((layer, index) => (
                <option
                  className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                  value={layer}
                  key={index}
                >
                  {layer}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center w-full">
            <select
              id="fileFormat-select"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-full p-2 hover:bg-opacity-80"
            >
              {layers[wmsSelectedLayer].map((style, index) => (
                <option
                  className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                  value={style}
                  key={index}
                >
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

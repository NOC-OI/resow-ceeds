import React from 'react'
import { allColorScales } from '../../lib/map/jsColormaps'
import { CustomUploadFile } from '../CustomUploadFile'

interface UploadLayerGeoJSONGeoTIFFProps {
  handleFileChange: any
  handleFileChangeProj: any
  labelText: any
  labelPrjText: any
  actualLayerUpload: any
  colorScale: any
  setColorScale: any
  handleColorChange: any
}

export function UploadLayerGeoJSONGeoTIFF({
  handleFileChange,
  handleFileChangeProj,
  labelText,
  labelPrjText,
  actualLayerUpload,
  colorScale,
  setColorScale,
  handleColorChange,
}: UploadLayerGeoJSONGeoTIFFProps) {
  return (
    <div className="w-full">
      <CustomUploadFile
        label={labelText}
        onChange={handleFileChange}
        text={
          actualLayerUpload.dataType === 'Shapefile'
            ? 'Upload Shp File'
            : 'Upload File'
        }
      />
      {actualLayerUpload.dataType === 'Shapefile' && (
        <div className="flex justify-between w-full items-center">
          <CustomUploadFile
            label={labelPrjText}
            onChange={handleFileChangeProj}
            text={'Upload Prj File:'}
            inputId="file_input_proj"
          />
        </div>
      )}
      <div className="pt-4 flex justify-between w-full items-center">
        <p className="text-md font-bold text-white mb-2 text-center">
          {['GeoJSON', 'Shapefile', 'KML', 'KMZ'].includes(
            actualLayerUpload.dataType,
          )
            ? 'Geometry Color:'
            : 'Color Scale:'}
        </p>
        <div className="flex flex-col items-center gap-1">
          {['GeoTIFF', 'ASC'].includes(actualLayerUpload.dataType) && (
            <div className="flex justify-between items-center w-full">
              <select
                id="fileFormat-select"
                value={colorScale}
                onChange={(e) => setColorScale(e.target.value)}
                className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-max p-2 hover:bg-opacity-80"
              >
                <option
                  className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                  value="Custom"
                >
                  Custom
                </option>
                {allColorScales.map((allColorScale, index) => (
                  <option
                    className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                    value={allColorScale}
                    key={index}
                  >
                    {allColorScale}
                  </option>
                ))}
              </select>
            </div>
          )}
          {colorScale === 'Custom' && (
            <div className="flex justify-end items-center gap-1">
              <input
                type="color"
                className="p-1 block bg-black  bg-opacity-30 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                id="hs-color-input"
                value={
                  typeof actualLayerUpload.colors === 'string'
                    ? actualLayerUpload.colors
                    : actualLayerUpload.colors[0]
                }
                onChange={(e) => handleColorChange(e, 0)}
                title="Choose your color"
              />
              {['GeoTIFF', 'ASC'].includes(actualLayerUpload.dataType) && (
                <input
                  type="color"
                  className="p-1 block bg-black bg-opacity-30  cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                  id="hs-color-input"
                  value={
                    typeof actualLayerUpload.colors === 'string'
                      ? actualLayerUpload.colors
                      : actualLayerUpload.colors[1]
                  }
                  onChange={(e) => handleColorChange(e, 1)}
                  title="Choose your color"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

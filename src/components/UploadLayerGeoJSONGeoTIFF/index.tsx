import React from 'react'
import { allColorScales } from '../../lib/map/jsColormaps'

interface UploadLayerGeoJSONGeoTIFFProps {
  handleFileChange: any
  labelText: any
  labelPrjText: any
  actualLayerUpload: any
  colorScale: any
  setColorScale: any
  handleColorChange: any
}

export function UploadLayerGeoJSONGeoTIFF({
  handleFileChange,
  labelText,
  labelPrjText,
  actualLayerUpload,
  colorScale,
  setColorScale,
  handleColorChange,
}: UploadLayerGeoJSONGeoTIFFProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between w-full items-center">
        <p className="pt-4 text-md font-bold text-white mb-2 text-center">
          {actualLayerUpload.dataType === 'Shapefile'
            ? 'Upload Shp File'
            : 'Upload File'}
        </p>
        <div className="flex justify-center gap-6 items-center">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file:
          </label>
          <input
            id="file_input"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <label
            htmlFor="file_input"
            className="block w-full text-sm text-white rounded-lg cursor-pointer bg-black bg-opacity-50 hover:bg-opacity-80"
            style={{ padding: '10px', textAlign: 'center' }}
          >
            {labelText}
          </label>
        </div>
      </div>
      {actualLayerUpload.dataType === 'Shapefile' && (
        <div className="flex justify-between w-full items-center">
          <p className="pt-4 text-md font-bold text-white mb-2 text-center">
            Upload Prj File:
          </p>
          <div className="flex justify-center gap-0 items-center">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="file_proj_input"
            >
              Upload file:
            </label>
            <input
              id="file_proj_input"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, true)}
            />
            <label
              htmlFor="file_proj_input"
              className="block w-full text-sm text-white rounded-lg cursor-pointer bg-black bg-opacity-50 hover:bg-opacity-80"
              style={{ padding: '10px', textAlign: 'center' }}
            >
              {labelPrjText}
            </label>
          </div>
        </div>
      )}
      <div className="pt-4 flex justify-between w-full items-center">
        <p className="text-md font-bold text-white mb-2 text-center">
          {['GeoJSON', 'Shapefile'].includes(actualLayerUpload.dataType)
            ? 'Geometry Colors:'
            : 'Color Scale:'}
        </p>
        <div className="flex flex-col items-center gap-1">
          {actualLayerUpload.dataType === 'GeoTIFF' && (
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
                value={actualLayerUpload.colors[0]}
                onChange={(e) => handleColorChange(e, 0)}
                title="Choose your color"
              />
              {actualLayerUpload.dataType === 'GeoTIFF' && (
                <input
                  type="color"
                  className="p-1 block bg-black bg-opacity-30  cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                  id="hs-color-input"
                  value={actualLayerUpload.colors[1]}
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

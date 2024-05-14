import React from 'react'
import { CssTextField } from '../DownloadSelection/styles'
import { allColorScales } from '../../lib/map/jsColormaps'

interface UploadLayerCOGProps {
  setLocalUploadInfo: any
  colorScale: any
  setColorScale: any
}

export function UploadLayerCOG({
  setLocalUploadInfo,
  colorScale,
  setColorScale,
}: UploadLayerCOGProps) {
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
      </div>
      <div className="pt-4 flex justify-between w-full items-center">
        <p className="text-md font-bold text-white mb-2 text-center">
          Color Scale:
        </p>
        <div className="flex flex-col items-center gap-1">
          <div className="flex justify-between items-center w-full">
            <select
              id="fileFormat-select"
              value={colorScale}
              onChange={(e) => setColorScale(e.target.value)}
              className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-max p-2 hover:bg-opacity-80"
            >
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
        </div>
      </div>
    </div>
  )
}

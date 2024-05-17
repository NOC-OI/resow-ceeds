import React from 'react'
import { CssTextField } from '../DownloadSelection/styles'
import { CustomInputToogle } from '../CustomInputToogle'
import { CustomUploadFile } from '../CustomUploadFile'

interface UploadLayerCSVProps {
  handleFileChange: any
  labelText: any
  csvData: any
  setCsvData: any
  delimiterList: any
  actualLayerUpload: any
  handleColorChange: any
}

export function UploadLayerCSV({
  handleFileChange,
  labelText,
  csvData,
  setCsvData,
  delimiterList,
  actualLayerUpload,
  handleColorChange,
}: UploadLayerCSVProps) {
  function changeCSVHeader(e) {
    setCsvData({ ...csvData, header: e.target.checked })
  }
  return (
    <div className="w-full">
      <CustomUploadFile label={labelText} onChange={handleFileChange} />
      <div className="pt-4 flex justify-between w-full items-center">
        <p className="text-md font-bold text-white mb-2 text-center">Color</p>
        <div className="flex flex-col items-center gap-1">
          <div className="flex justify-end items-center gap-1">
            <input
              type="color"
              className="p-1 block bg-black  bg-opacity-30 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
              id="hs-color-input"
              value={actualLayerUpload.colors[0]}
              onChange={(e) => handleColorChange(e, 0)}
              title="Choose your color"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between w-full items-center pt-2">
        <div className="flex justify-between items-center gap-2 w-full">
          <p className="pt-4 text-md font-bold text-white mb-2 text-center">
            Delimiter:
          </p>
          <div className="flex justify-between items-center w-full">
            <select
              id="delimiter"
              value={
                csvData.delimiterType === 'other' ? 'other' : csvData.delimiter
              }
              onChange={(e) =>
                setCsvData({
                  ...csvData,
                  delimiter: e.target.value === 'other' ? '' : e.target.value,
                  delimiterType:
                    e.target.value === 'other' ? 'other' : 'normal',
                })
              }
              className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-max p-2 hover:bg-opacity-80"
            >
              {delimiterList.map((delimiter, index) => (
                <option
                  className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                  value={delimiter}
                  key={index}
                >
                  {delimiter}
                </option>
              ))}
            </select>
            {csvData.delimiterType === 'other' && (
              <CssTextField
                id="delimiter"
                label="Other"
                type="text"
                name="delimiter"
                variant="standard"
                value={csvData.delimiter}
                className="w-20"
                InputLabelProps={{
                  style: {
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '100%',
                    color: 'white',
                    borderWidth: '1px',
                    borderColor: 'white !important',
                  },
                }}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCsvData({ ...csvData, delimiter: e.target.value })
                }
                InputProps={{
                  style: {
                    color: 'white',
                  },
                }}
              />
            )}
          </div>
        </div>
        <CustomInputToogle
          onChange={changeCSVHeader}
          label={'Contain Header?'}
          column={false}
        />
      </div>
      <div className="flex justify-between w-full items-center pt-2 gap-2">
        <CssTextField
          id="lat-column"
          label={csvData.header ? 'Lat Column Name' : 'Lat Column Number'}
          type={csvData.header ? 'text' : 'number'}
          name="lat-column"
          variant="standard"
          value={
            csvData.header
              ? csvData.latLngColumnNames[0]
              : csvData.latLngColumnNumbers[0]
          }
          className="w-36"
          InputLabelProps={{
            style: {
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              width: '100%',
              color: 'white',
              borderWidth: '1px',
              borderColor: 'white !important',
            },
          }}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            csvData.header
              ? setCsvData({
                  ...csvData,
                  latLngColumnNames: [
                    e.target.value,
                    csvData.latLngColumnNames[1],
                  ],
                })
              : setCsvData({
                  ...csvData,
                  latLngColumnNumbers: [
                    Number(e.target.value),
                    csvData.latLngColumnNumbers[1],
                  ],
                })
          }
          InputProps={{
            style: {
              color: 'white',
            },
          }}
        />
        <CssTextField
          id="lng-column"
          label={csvData.header ? 'Lng Column Name' : 'Lng Column Number'}
          type={csvData.header ? 'text' : 'number'}
          name="lng-column"
          variant="standard"
          value={
            csvData.header
              ? csvData.latLngColumnNames[1]
              : csvData.latLngColumnNumbers[1]
          }
          className="w-36"
          InputLabelProps={{
            style: {
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              width: '100%',
              color: 'white',
              borderWidth: '1px',
              borderColor: 'white !important',
            },
          }}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            csvData.header
              ? setCsvData({
                  ...csvData,
                  latLngColumnNames: [
                    csvData.latLngColumnNames[0],
                    e.target.value,
                  ],
                })
              : setCsvData({
                  ...csvData,
                  latLngColumnNumbers: [
                    csvData.latLngColumnNumbers[0],
                    Number(e.target.value),
                  ],
                })
          }
          InputProps={{
            style: {
              color: 'white',
            },
          }}
        />
      </div>
    </div>
  )
}

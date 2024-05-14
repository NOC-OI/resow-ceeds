import React from 'react'
import styles1 from '../DataExplorationTypeOptions/DataExplorationTypeOptions.module.css'
import { CssTextField } from '../DownloadSelection/styles'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'

interface UploadLayerCSVProps {
  handleFileChange: any
  labelText: any
  csvData: any
  setCsvData: any
}

export function UploadLayerCSV({
  handleFileChange,
  labelText,
  csvData,
  setCsvData,
}: UploadLayerCSVProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between w-full items-center pt-2">
        <p className="pt-4 text-md font-bold text-white mb-2 text-center">
          Upload File
        </p>
        <div className="flex justify-center gap-2 items-center">
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
            style={{
              padding: '10px',
              textAlign: 'center',
            }}
          >
            {labelText}
          </label>
        </div>
      </div>
      <div className="flex justify-between w-full items-center pt-2">
        <CssTextField
          id="delimiter"
          label="Delimiter"
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
        <LayerTypeOptionsContainer>
          <div id="type-option" className="flex flex-col items-center">
            <label htmlFor="contain-header" title="contain header?">
              <input
                id="contain-header"
                onChange={(e) =>
                  setCsvData({ ...csvData, header: e.target.checked })
                }
                className={styles1.chk}
                type="checkbox"
                name="baseLayer"
              />
              <label
                htmlFor="contain-header"
                className={styles1.switch}
                title="layer uploaded"
              >
                <span className={styles1.slider}></span>
              </label>
              <p>Contain Header?</p>
            </label>
          </div>
        </LayerTypeOptionsContainer>
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

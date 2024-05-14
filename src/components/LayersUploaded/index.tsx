import {
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { useUploadDataHandle } from '../../lib/data/uploadDataManagement'
import { CalcTypeContainer } from '../DataExplorationType/styles'
import { LayersUploadedOptions } from '../LayersUploadedOptions'

interface LayersUploadedProps {
  layerAction: string
  setLayerAction: any
  layerLegend: any
  setLayerLegend: any
}

export function LayersUploaded({
  layerAction,
  setLayerAction,
  layerLegend,
  setLayerLegend,
}: LayersUploadedProps) {
  const { listLayersUpload } = useUploadDataHandle()

  return (
    <div>
      <LayerSelectionTitle>
        <h1>Layers Uploaded</h1>
      </LayerSelectionTitle>
      <LayerTypes>
        <CalcTypeContainer>
          <div className="flex flex-col gap-1 pt-1">
            {Object.keys(listLayersUpload).map((layerClass: any) => {
              return (
                <LayersUploadedOptions
                  key={layerClass}
                  layerClass={layerClass}
                  layerAction={layerAction}
                  setLayerAction={setLayerAction}
                  layerLegend={layerLegend}
                  setLayerLegend={setLayerLegend}
                />
              )
            })}
          </div>
        </CalcTypeContainer>
      </LayerTypes>
      {Object.keys(listLayersUpload).length > 0 && (
        <p className="text-center italic text-sm">
          If you refresh or close this page, this list will be erased
        </p>
      )}
    </div>
  )
}

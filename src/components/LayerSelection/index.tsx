import { LayerSelectionContainer, LayerSelectionTitle} from "./styles";
import { useState } from "react";
import { LayerType } from "../LayerType";
import * as L from 'leaflet';

interface LayerSelectionProps{
  selectedLayers: Object,
  setSelectedLayers: any,
  actualLayer: any,
  setActualLayer: any,
  layerAction: String,
  setLayerAction: any,
}

export function LayerSelection({selectedLayers, setSelectedLayers, actualLayer, setActualLayer, layerAction, setLayerAction}: LayerSelectionProps) {

  const [layerClasses, setLayerClasses] = useState([{
    layerClass: 'Seabed Habitats',
    layerNames: {
      Emodnet: {
        url: 'https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/wms?',
        data_type: 'WMS',
        params: {
          service: 'WMS',
          attribution: actualLayer,
          request: 'GetMap',
          version: '1.3.0',
          layers: 'eusm2021_eunis2019_group',
          format: 'image/png',
          transparent: 'true',
          info_format: 'text/html',
          tiled: 'false',
          width: '150',
          height: '125',
          bounds: L.latLngBounds([[46, -10],[50, 2]])
        },
      },
    },
  },
  {
    layerClass: 'Bathymetry',
    layerNames: {
      Emodnet: {
        url: 'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_EMODNet_2020.tif',
        data_type: 'COG'
      },
      Gebco: {
        url: 'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_gebco_2022.tif',
        data_type: 'COG'
      }
    },
  },
  {
    layerClass: 'Seabed Images',
    layerNames: {
      Image1: {
        url: 'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/output/output_raster_cog.tif',
        data_type: 'COG'
      },
      Image2: {
        url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987749054970_1.tif',
        data_type: 'COG'
      },
      Image3: {
        url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987749390121_1.tif',
        data_type: 'COG'
      },
      Image4: {
        url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987755746830_1.tif',
        data_type: 'COG'
      },
      Image5: {
        url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987757649461_1.tif',
        data_type: 'COG'
      },
    },
  }])

  return (
    <LayerSelectionContainer>
      <LayerSelectionTitle>
        <h1>Layer Selection</h1>
      </LayerSelectionTitle>
        {layerClasses.map(layerClass => {
          return (
            <LayerType
              key={layerClass.layerClass}
              content={layerClass.layerClass}
              childs={layerClass.layerNames}
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              actualLayer={actualLayer}
              setActualLayer={setActualLayer}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
            />
          )
        })}
    </LayerSelectionContainer>
  )
}

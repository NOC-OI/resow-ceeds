let listValues = [{
  layerClass: 'Seabed Habitats',
  layerNames: {
    "Habitat Map": {
      url: 'https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'eusm2021_eunis2019_group',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "Biozones": {
      url: 'https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'eusm2021_bio_full',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "Energy Class": {
      url: 'https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'eusm2021_ene_full',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "JNCC Broad-scale Habitats - Polygon": {
      url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'mcz_bsh_poly',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "JNCC Broad-scale Habitats - Points": {
      url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'mcz_bsh_point',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "Annex I - Reefs": {
      url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'prot_annexi_reef_full',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
  },
},
{
  layerClass: 'Biology',
  layerNames: {
    "Presence/Absence Benthos": {
      url: 'https://ows.emodnet.eu/geoserver/biology/ows?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'probability_occurrence_benthos_northsea',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "Fraction of Mixoplancton": {
      url: 'https://ows.emodnet.eu/geoserver/biology/ows?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'fraction_mixoplankton',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "Invasive Macroalgae": {
      url: 'https://geo.vliz.be/geoserver/Emodnetbio/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'kuenm_models',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
  },

},
{
  layerClass: 'Geology',
  layerNames: {
    "Seabed Substrate": {
      url: 'https://drive.emodnet-geology.eu/geoserver/gtk/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'gtk:seabed_substrate_250k',
        format: 'image/png',
        style: 'gtk:folk_16_substrate_class',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "Geological Process Features": {
      url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'geolpf_mcz',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
  },
},
{
  layerClass: 'Administrative Areas',
  layerNames: {
    "UK Territorial Sea Limit": {
      url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'ukts',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "UK Continental Shelf and ZEE": {
      url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'ukcs',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "UK Waters": {
      url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'uk_countrywaters',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "Biogeogaphic Regions": {
      url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'cp2regions',
        format: 'image/png',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
  },
},
{
  layerClass: 'Chemistry',
  layerNames: {
    "Chlorophyll-a": {
      url: 'https://ec.oceanbrowser.net/emodnet/Python/web/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'All_European_Seas/Water_body_chlorophyll-a.nc*Water body chlorophyll-a_L2',
        format: 'image/png',
        style: 'pcolor_flat',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "Dissolved Oxygen": {
      url: 'https://ec.oceanbrowser.net/emodnet/Python/web/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'All_European_Seas/Water_body_dissolved_oxygen_concentration.nc*Water body dissolved oxygen concentration_L2',
        format: 'image/png',
        style: 'pcolor_flat',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "Inorganic Nitrogen": {
      url: 'https://ec.oceanbrowser.net/emodnet/Python/web/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'All_European_Seas/Water_body_dissolved_inorganic_nitrogen.nc*Water body dissolved inorganic nitrogen_L2',
        format: 'image/png',
        style: 'pcolor_flat',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "Phosphate": {
      url: 'https://ec.oceanbrowser.net/emodnet/Python/web/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'All_European_Seas/Water_body_phosphate.nc*Water body phosphate_L2',
        format: 'image/png',
        style: 'pcolor_flat',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
      },
    },
    "Silicate": {
      url: 'https://ec.oceanbrowser.net/emodnet/Python/web/wms?',
      data_type: 'WMS',
      params: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: 'All_European_Seas/Water_body_silicate.nc*Water body silicate_L2',
        format: 'image/png',
        style: 'pcolor_flat',
        transparent: true,
        info_format: 'text/html',
        width: '20',
        height: '20',
        viewParams: 'null;undefined',
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
},
{
  layerClass: 'Seabed Images 2',
  layerNames: {
    Image1: {
      url: 'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/output/output_raster_cog.tif',
      data_type: 'Marker-COG'
    },
    Image2: {
      url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987749054970_1.tif',
      data_type: 'Marker-COG'
    },
    Image3: {
      url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987749390121_1.tif',
      data_type: 'Marker-COG'
    },
    Image4: {
      url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987755746830_1.tif',
      data_type: 'Marker-COG'
    },
    Image5: {
      url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987757649461_1.tif',
      data_type: 'Marker-COG'
    },
  },

}]

function sortListLayers(listLayers: any[]){
  let sortedList: string[] = []
  listLayers.forEach(listLayer => {
    sortedList.push(listLayer.layerClass)
  })
  sortedList.sort()
  let newSortedList: any[] = []
  sortedList.forEach(sorted => {
    listLayers.forEach(listLayer => {
      if (sorted === listLayer.layerClass){
        newSortedList.push(listLayer)
      }
    })
  })
  return newSortedList
}

export const listLayers = sortListLayers(listValues)

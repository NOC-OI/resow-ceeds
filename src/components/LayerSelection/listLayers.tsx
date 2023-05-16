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
      content: 'Output of the 2021 EUSeaMap broad-scale predictive model, produced by EMODnet Seabed Habitats. \n \
        The extent of the mapped area includes the Mediterranean Sea, Black Sea, Baltic Sea, and areas of the North Eastern Atlantic extending from the Canary Islands in the south to the Barents Sea in the north. \n \
        The map was produced using a "top-down" modelling approach using classified habitat descriptors to determine a final output habitat. \n \
        Habitat descriptors differ per region but include: \n \
        - Biological zone \n \
        - Energy class \n \
        - Oxygen regime \n \
        - Salinity regime \n \
        - Seabed substrate \n \
        - Riverine input \n \
        Habitat descriptors (excepting Substrate) are calculated using underlying physical data and thresholds derived from statistical analyses or expert judgement on known conditions. \n \
        The model is produced using R and Arc Model Builder (10.1). \n \
        The model was created using raster input layers with a cell size of 0.00104dd (roughly 100 metres). The model includes the sublittoral zone only; due to the high variability of the littoral zone, a lack of detailed substrate data and the resolution of the model, it is difficult to predict littoral habitats at this scale. \n \
        EUSeaMap is classified into EUNIS 2019 level 3 (or more detailed levels where appropriate), EUNIS 2019 level 2 , EUNIS 2007-2011, the MSFD benthic broad habitat types, the HELCOM HUB classification in the Baltic, and the recently revised habitat classification in the Mediterranean. In the Black Sea, EUSeaMap is not classified into EUNIS 2007-2011 (due to inapplicability), but is classified according to a classification that was developed by EMODnet Seabed Habitats (Populus et a, 2017, and for a revised version Vasquez et al, 2020, See Online resources). \n \
        Reports that provide methods used for the classification of the predicted habitats into the new 2019 EUNIS classification, regional classifications, and MSFD BBHT (v.2017) are linked in Online Resources. \n \
        A report on the methods used in the 2021 version of EUSeaMap (Vasquez et al., 2021) and reports on previous versions (v2016 and V2019) are linked in Online Resources. \n '
    },
    "Habitat Map 2": {
      url: 'http://127.0.0.1:8080/v1/tiles/mytiles@1.0.0/{z}/{x}/{y}.mvt',
      data_type: 'MBTiles',
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'Output of the 2021 EUSeaMap broad-scale predictive model, produced by EMODnet Seabed Habitats. \n \
        The extent of the mapped area includes the Mediterranean Sea, Black Sea, Baltic Sea, and areas of the North Eastern Atlantic extending from the Canary Islands in the south to the Barents Sea in the north. \n \
        The map was produced using a "top-down" modelling approach using classified habitat descriptors to determine a final output habitat. \n \
        Habitat descriptors differ per region but include: \n \
        - Biological zone \n \
        - Energy class \n \
        - Oxygen regime \n \
        - Salinity regime \n \
        - Seabed substrate \n \
        - Riverine input \n \
        Habitat descriptors (excepting Substrate) are calculated using underlying physical data and thresholds derived from statistical analyses or expert judgement on known conditions. \n \
        The model is produced using R and Arc Model Builder (10.1). \n \
        The model was created using raster input layers with a cell size of 0.00104dd (roughly 100 metres). The model includes the sublittoral zone only; due to the high variability of the littoral zone, a lack of detailed substrate data and the resolution of the model, it is difficult to predict littoral habitats at this scale. \n \
        EUSeaMap is classified into EUNIS 2019 level 3 (or more detailed levels where appropriate), EUNIS 2019 level 2 , EUNIS 2007-2011, the MSFD benthic broad habitat types, the HELCOM HUB classification in the Baltic, and the recently revised habitat classification in the Mediterranean. In the Black Sea, EUSeaMap is not classified into EUNIS 2007-2011 (due to inapplicability), but is classified according to a classification that was developed by EMODnet Seabed Habitats (Populus et a, 2017, and for a revised version Vasquez et al, 2020, See Online resources). \n \
        Reports that provide methods used for the classification of the predicted habitats into the new 2019 EUNIS classification, regional classifications, and MSFD BBHT (v.2017) are linked in Online Resources. \n \
        A report on the methods used in the 2021 version of EUSeaMap (Vasquez et al., 2021) and reports on previous versions (v2016 and V2019) are linked in Online Resources. \n '
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'Output of the 2021 EUSeaMap broad-scale predictive model, produced by EMODnet Seabed Habitats. \n \
        The extent of the mapped area includes the Mediterranean Sea, Black Sea, Baltic Sea, and areas of the North Eastern Atlantic extending from the Canary Islands in the south to the Barents Sea in the north. \n \
        The map was produced using a "top-down" modelling approach using classified habitat descriptors to determine a final output habitat. \n \
        Habitat descriptors differ per region but include: \n \
        - Biological zone \n \
        - Energy class \n \
        - Oxygen regime \n \
        - Salinity regime \n \
        - Seabed substrate \n \
        - Riverine input \n \
        Habitat descriptors (excepting Substrate) are calculated using underlying physical data and thresholds derived from statistical analyses or expert judgement on known conditions. \n \
        The model is produced using R and Arc Model Builder (10.1). \n \
        The model was created using raster input layers with a cell size of 0.00104dd (roughly 100 metres). The model includes the sublittoral zone only; due to the high variability of the littoral zone, a lack of detailed substrate data and the resolution of the model, it is difficult to predict littoral habitats at this scale. \n \
        EUSeaMap is classified into EUNIS 2019 level 3 (or more detailed levels where appropriate), EUNIS 2019 level 2 , EUNIS 2007-2011, the MSFD benthic broad habitat types, the HELCOM HUB classification in the Baltic, and the recently revised habitat classification in the Mediterranean. In the Black Sea, EUSeaMap is not classified into EUNIS 2007-2011 (due to inapplicability), but is classified according to a classification that was developed by EMODnet Seabed Habitats (Populus et a, 2017, and for a revised version Vasquez et al, 2020, See Online resources). \n \
        Reports that provide methods used for the classification of the predicted habitats into the new 2019 EUNIS classification, regional classifications, and MSFD BBHT (v.2017) are linked in Online Resources. \n \
        A report on the methods used in the 2021 version of EUSeaMap (Vasquez et al., 2021) and reports on previous versions (v2016 and V2019) are linked in Online Resources. \n '
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
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
      content: 'This layer represents...',
    },
  },
},
{
  layerClass: 'Bathymetry',
  layerNames: {
    Emodnet: {
      url: 'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/output/cog_rep_EMODNet_2020.tif',
      data_type: 'COG',
      content: 'This layer represents...',
    },
    Gebco: {
      url: 'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/output/cog_rep_gebco_2022.tif',
      data_type: 'COG',
      content: 'This layer represents...',
    }
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

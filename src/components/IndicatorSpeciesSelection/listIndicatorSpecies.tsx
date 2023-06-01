const organisms = [
  'Bryozoa_01',
  'Porifera_23',
  'Axinellidae_spp',
  'Porella sp.',
  'Parazoanthus sp.',
  'Anthozoa_34',
  'Anthozoa_39',
  'Lepidorhombus whiffiagonis',
  'Perciformes spp.10',
  'Gadidae spp.',
  'Paguridae_02',
  'Bolocera spp.',
  'Anthozoa_16',
  'Cerianthid_01',
  'Anthozoa_03',
  'Porifera_20',
  'Salamancina dysteri',
  'Munida sp.',
  'Echinus esculentus',
  'Reteporella spp.',
  'Stichastrrella rosea',
  'Antedon spp.',
  'Paguridae_01',
  'Liocarcinus spp.',
  'Hippoglossoides platessoides',
]

const calcNames: any[] = []
organisms.forEach((organism: string) => {
  calcNames.push({
    name: organism,
    url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=organism&crs=epsg%3A4326&extension=csv&exclude_index=True&agg_columns=first:FileName,first:FileFormat',
    layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
  })
})

const listValues = [
  {
    calcClass: 'Species of interest',
    content: 'This calculation uses XXXXX...',
    calcNames,
  },
]

function sortListLayers(values: any[]) {
  return values
}

export const listIndicatorSpecies = sortListLayers(listValues)

const organisms = [
  'Abietinaria',
  'Actiniaria',
  'Actinopterygii',
  'Adamsia palliata',
  'Aeolidiidae',
  'Aglaophenia',
  'Amphiura',
  'Ancula gibbosa',
  'Antedon bifida',
  'Anthozoa',
  'Ascidiacea',
  'Astropecten irregularis',
  'Atrina fragilis',
  'Aulactinia verrucosa',
  'Aureliania heterocera',
  'Axinella sp',
  'Buccinidae',
  'Cariidea',
  'Caryophyllia smithii',
  'Cerianthus lloydii',
]

const calcNames: any[] = []
organisms.forEach((organism: string) => {
  calcNames.push({
    name: organism,
    url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=organism&crs=epsg%3A4326&extension=csv&agg_columns=sum:Area_seabed_m2,first:FileName',
  })
})

const listValues = [
  {
    calcClass: 'Indicator Species',
    content: 'This calculation uses XXXXX...',
    calcNames,
  },
]

function sortListLayers(values: any[]) {
  return values
}

export const listIndicatorSpecies = sortListLayers(listValues)

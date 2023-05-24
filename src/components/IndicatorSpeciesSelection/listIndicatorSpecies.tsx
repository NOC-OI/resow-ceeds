const organisms = [
  'antedon',
  'anthozoa',
  'anthozoa_01',
  'anthozoa_03',
  'anthozoa_05',
  'anthozoa_06',
  'anthozoa_07',
  'anthozoa_08',
  'anthozoa_11',
  'anthozoa_16',
  'anthozoa_19',
  'anthozoa_24',
  'anthozoa_34',
  'anthozoa_39',
  'asterias_rubens',
]

const calcNames: any[] = []
organisms.forEach((organism: string) => {
  calcNames.push({
    name: organism,
    url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Substratum',
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

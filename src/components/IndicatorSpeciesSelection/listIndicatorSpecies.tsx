const listValues = [
  {
    calcClass: 'Community Analysis',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      {
        name: 'Select sample unit size',
        url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Habitat',
      },
      {
        name: 'Create sample units',
        url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Habitat',
      },
    ],
  },
  {
    calcClass: 'Community Metrics',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      {
        name: 'Density of organisms',
        url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Substratum',
      },
      {
        name: 'Diversity of organisms',
        url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Substratum',
      },
    ],
  },
]

function sortListLayers(values: any[]) {
  return values
}

export const listIndicatorSpecies = sortListLayers(listValues)

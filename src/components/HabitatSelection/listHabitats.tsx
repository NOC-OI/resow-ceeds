const listValues = [
  {
    calcClass: 'Habitats',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      {
        name: 'Number',
        url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Habitat',
      },
      {
        name: 'Types',
        url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Habitat',
      },
    ],
  },
  {
    calcClass: 'Substrates',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      {
        name: 'Number',
        url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Substratum',
      },
      {
        name: 'Types',
        url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Substratum',
      },
    ],
  },
]

function sortListLayers(values: any[]) {
  return values
}

export const listHabitats = sortListLayers(listValues)
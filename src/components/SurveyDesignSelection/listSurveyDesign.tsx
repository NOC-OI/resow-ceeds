const listValues = [
  {
    calcClass: 'Temporal representation',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      // {
      //   name: 'Number',
      //   url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Habitat',
      // },
      // {
      //   name: 'Types',
      //   url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Habitat',
      // },
    ],
  },
  {
    calcClass: 'Spatial representation',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      // {
      //   name: 'Number',
      //   url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Substratum',
      // },
      // {
      //   name: 'Types',
      //   url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Substratum',
      // },
    ],
  },
  {
    calcClass: 'Habitat representation',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      // {
      //   name: 'Number',
      //   url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Substratum',
      // },
      // {
      //   name: 'Types',
      //   url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Substratum',
      // },
    ],
  },
  {
    calcClass: 'Biodiversity representation',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      // {
      //   name: 'Number',
      //   url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Substratum',
      // },
      // {
      //   name: 'Types',
      //   url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Substratum',
      // },
    ],
  },
]

function sortListLayers(values: any[]) {
  return values
}

export const listSurveyDesign = sortListLayers(listValues)

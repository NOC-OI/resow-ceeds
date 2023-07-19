const listValues = [
  {
    calcClass: 'Biodiversity representation',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      {
        name: 'Density',
        url: 'v1/data/csv?orient=list&skip_lines=7',
        habitat: ['coarse', 'sand', 'intermediate', 'hard'],
      },
      {
        name: 'Biodiversity',
        url: 'v1/data/csv?orient=list&skip_lines=7',
        habitat: ['coarse', 'sand', 'intermediate', 'hard'],
        biodiversity: {
          'Species richness': 'Hill0',
          "Shannon index (expH')": 'Hill1',
          "Simpson's index": 'Hill2',
        },
      },
    ],
  },
  {
    calcClass: 'Temporal representation',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      // {
      //   name: 'Number',
      //   url: 'data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Habitat',
      // },
      // {
      //   name: 'Types',
      //   url: 'data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Habitat',
      // },
    ],
  },
  {
    calcClass: 'Spatial representation',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      // {
      //   name: 'Number',
      //   url: 'data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Substratum',
      // },
      // {
      //   name: 'Types',
      //   url: 'data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Substratum',
      // },
    ],
  },
  {
    calcClass: 'Habitat representation',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      // {
      //   name: 'Number',
      //   url: 'data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Substratum',
      // },
      // {
      //   name: 'Types',
      //   url: 'data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Substratum',
      // },
    ],
  },
]

function sortListLayers(values: any[]) {
  return values
}

export const listSurveyDesign = sortListLayers(listValues)

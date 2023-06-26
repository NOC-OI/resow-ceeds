/* eslint-disable no-multi-str */

const listValues = [
  // {
  //   calcClass: 'Information',
  //   content: 'This calculation uses XXXXX...',
  //   calcNames: [
  //     {
  //       name: 'Target Sample Size',
  //       url: 'data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Habitat',
  //     },
  //     {
  //       name: 'Number of Sample Units',
  //       url: 'data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Habitat',
  //     },
  //     {
  //       name: 'Mean Sample Unit Size',
  //       url: 'data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Habitat',
  //     },
  //   ],
  // },
  {
    calcClass: 'Diversity across survey',
    content:
      'Number of morphotypes using all tiles from seabed images captured with the autonomous \
    underwater vehicle in 2012 survey.',
    calcNames: [
      {
        name: 'Morphotypes',
        url: 'v1/calc?filenames=output:HF2012_alltile_counts&calc=biodiversity2&crs=epsg%3A4326&extension=csv',
        layers: { 'Seabed Images': ['2012 AUV Image Survey'] },
        noButton: true,
        decimalPlaces: 0,
      },
    ],
  },
  {
    calcClass: 'Diversity by Substrate',
    content:
      "Biodiversity metrics exponential Shannon index (expH') and the \
     inverse form of Simpson's index (1/D) (Magurran 2004) are computed for \
     each substrate type. Values are shown as mean +/- standard deviation \
     across sample units. \n \
     Reference: Magurran, A.E., 2004. Measuring Biological Diversity. \
     Blackwell Publishing, Oxford, UK.",
    calcNames: [
      {
        name: 'Density of benthic megafauna',
        url: 'v1/calc?filenames=output:HF2012_SU&crs=epsg%3A4326&extension=csv&calc=biodiversity1&calc_columns=substratum',
        layers: { 'Seabed Images': ['2012 AUV Image Survey'] },
        decimalPlaces: 3,
        noButton: true,
      },
      {
        name: 'Number of morphotypes',
        url: 'v1/calc?filenames=output:HF2012_SU&crs=epsg%3A4326&extension=csv&calc=biodiversity3&calc_columns=substratum',
        decimalPlaces: 3,
        noButton: true,
      },
      {
        name: "Shannon index (expH')",
        url: 'v1/calc?filenames=output:HF2012_SU&crs=epsg%3A4326&extension=csv&calc=biodiversity4&calc_columns=substratum',
        layers: { 'Seabed Images': ['2012 AUV Image Survey'] },
        decimalPlaces: 2,
        noButton: true,
      },
      {
        name: "Inverse Simpson's index",
        url: 'v1/calc?filenames=output:HF2012_SU&crs=epsg%3A4326&extension=csv&calc=biodiversity5&calc_columns=substratum',
        layers: { 'Seabed Images': ['2012 AUV Image Survey'] },
        decimalPlaces: 2,
        noButton: true,
      },
    ],
  },
]

function sortListLayers(values: any[]) {
  return values
}

// {
//   name: 'Number',
//   url: 'data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts&calc=count&crs=epsg%3A4326&extension=csv&column=substratum',
//   layers: { 'Seabed Images': ['2012 AUV Image Survey'] },
// },
// {
//   name: 'Types',
//   url: 'data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=sum:area_seabed_m2,first:filename,first:fileformat,count:latitude&column=substratum',
//   layers: { 'Seabed Images': ['2012 AUV Image Survey'] },
// },

export const listBiodiversities = sortListLayers(listValues)

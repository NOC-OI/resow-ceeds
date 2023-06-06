/* eslint-disable no-multi-str */

const listValues = [
  // {
  //   calcClass: 'Information',
  //   content: 'This calculation uses XXXXX...',
  //   calcNames: [
  //     {
  //       name: 'Target Sample Size',
  //       url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count&crs=epsg%3A4326&extension=csv&column=Habitat',
  //     },
  //     {
  //       name: 'Number of Sample Units',
  //       url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Habitat',
  //     },
  //     {
  //       name: 'Mean Sample Unit Size',
  //       url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=unique&crs=epsg%3A4326&extension=csv&column=Habitat',
  //     },
  //   ],
  // },
  {
    calcClass: 'Community Metrics',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      {
        name: 'Density of benthic megafauna',
        url: '/data?filename=output:HF2012_SU&crs=epsg%3A4326&extension=csv&calc=biodiversity&column=substratum',
        layers: { 'Seabed Images': ['AUV 2012'] },
        decimalPlaces: 3,
      },
    ],
  },
  {
    calcClass: 'Biodiversity Metrics',
    content:
      "Biodiversity metrics exponential Shannon index (expH') and the \
     inverse form of Simpson’s index (1/D) (Magurran 2004) are computed for \
     each substrate type. Values are shown as mean +/- standard deviation \
     across sample units. \n \
     Reference: Magurran, A.E., 2004. Measuring Biological Diversity. \
     Blackwell Publishing, Oxford, UK.",
    calcNames: [
      {
        name: 'Diversity across survey',
        url: '/data?filename=output:HF2012_alltile_counts&calc=biodiversity1&crs=epsg%3A4326&extension=csv',
        layers: { 'Seabed Images': ['AUV 2012'] },
        noButton: true,
        decimalPlaces: 0,
      },
      {
        name: 'Number of morphotypes per sample unit',
        url: '/data?filename=output:HF2012_SU&crs=epsg%3A4326&extension=csv&calc=biodiversity2&column=substratum',
        layers: { 'Seabed Images': ['AUV 2012'] },
        decimalPlaces: 3,
      },
      {
        name: "Shannon index (expH') per sample unit",
        url: '/data?filename=output:HF2012_SU&crs=epsg%3A4326&extension=csv&calc=biodiversity3&column=substratum',
        layers: { 'Seabed Images': ['AUV 2012'] },
        decimalPlaces: 2,
      },
      {
        name: "Inverse Simpson's index per sample unit",
        url: '/data?filename=output:HF2012_SU&crs=epsg%3A4326&extension=csv&calc=biodiversity4&column=substratum',
        layers: { 'Seabed Images': ['AUV 2012'] },
        decimalPlaces: 2,
      },
    ],
  },
]

function sortListLayers(values: any[]) {
  return values
}

// {
//   name: 'Number',
//   url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts&calc=count&crs=epsg%3A4326&extension=csv&column=substratum',
//   layers: { 'Seabed Images': ['AUV 2012'] },
// },
// {
//   name: 'Types',
//   url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=sum:area_seabed_m2,first:filename,first:fileformat,count:latitude&column=substratum',
//   layers: { 'Seabed Images': ['AUV 2012'] },
// },

export const listBiodiversities = sortListLayers(listValues)

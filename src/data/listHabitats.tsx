const listValues = [
  {
    calcClass: 'Habitats (Benoist *et al*. 2019)',
    content: 'Habitats from Benoist *et al*. 2019',
    calcNames: [
      {
        name: 'Number',
        url: 'v1/calc?filenames=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts&calc=count&crs=epsg%3A4326&extension=csv&calc_columns=habitat',
        layers: { 'Seabed Images': ['2012 AUV Image Survey'] },
      },
      {
        name: 'Type',
        url: 'v1/calc?filenames=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=first:habitatImage&calc_columns=habitat',
        layers: { 'Seabed Images': ['2012 AUV Image Survey'] },
      },
      // {
      //   name: 'Types - EUNIS',
      //   url: 'data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=first:filename,first:fileformat,count:Latitude&column=EUNIS.Habitat',
      //   layers: { 'Seabed Images': ['2012 AUV Image Survey', 'JNCC 1012'] },
      // },
    ],
  },
  {
    calcClass: 'UK Marine Habitat Classification',
    content: 'Habitats as defined by Marine Habitat Classification for Britain',
    calcNames: [
      {
        name: 'Number',
        url: 'v1/calc?filenames=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc/JNCC_CEND1012_otherdata&calc=count&crs=epsg%3A4326&extension=csv&calc_columns=UKMarineHabitat',
        layers: {
          'Seabed Images': ['2012 AUV Image Survey', 'JNCC CEND1012 Survey'],
        },
      },
      {
        name: 'Type',
        url: 'v1/calc?filenames=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=first:UKMarineHabitatImage&calc_columns=UKMarineHabitat',
        layers: {
          'Seabed Images': ['2012 AUV Image Survey', 'JNCC CEND1012 Survey'],
        },
      },
    ],
  },
  {
    calcClass: 'Substrates (Benoist *et al*. 2019)',
    content: 'Substrates from Benoist *et al*. 2019',
    calcNames: [
      {
        name: 'Number',
        url: 'v1/calc?filenames=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts&calc=count&crs=epsg%3A4326&extension=csv&calc_columns=substratum',
        layers: { 'Seabed Images': ['2012 AUV Image Survey'] },
      },
      {
        name: 'Type',
        url: 'v1/calc?filenames=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=first:substratumImage&calc_columns=substratum',
        layers: { 'Seabed Images': ['2012 AUV Image Survey'] },
      },
    ],
  },
]

function sortListLayers(values: any[]) {
  return values
}

export const listHabitats = sortListLayers(listValues)

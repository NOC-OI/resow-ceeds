const listValues = [
  {
    calcClass: 'Habitats (Benoist et al. 2019)',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      {
        name: 'Number',
        url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc/JNCC_CEND1012_otherdata&calc=count&crs=epsg%3A4326&extension=csv&column=habitat',
        layers: { 'Seabed Images': ['AUV 2012'] },
      },
      {
        name: 'Types',
        url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=first:filename,first:fileformat&column=habitat',
        layers: { 'Seabed Images': ['AUV 2012'] },
      },
      // {
      //   name: 'Types - EUNIS',
      //   url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=first:filename,first:fileformat,count:Latitude&column=EUNIS.Habitat',
      //   layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
      // },
    ],
  },
  {
    calcClass: 'UK Marine Habitat',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      {
        name: 'Number',
        url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc/JNCC_CEND1012_otherdata&calc=count&crs=epsg%3A4326&extension=csv&column=UKMarineHabitat',
        layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
      },
      {
        name: 'Types',
        url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=first:filename,first:fileformat&column=UKMarineHabitat',
        layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
      },
    ],
  },
  {
    calcClass: 'Substrates',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      {
        name: 'Number',
        url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=count&crs=epsg%3A4326&extension=csv&column=substratum',
        layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
      },
      {
        name: 'Types',
        url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=sum:area_seabed_m2,first:filename,first:fileformat,count:latitude&column=substratum',
        layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
      },
    ],
  },
]

function sortListLayers(values: any[]) {
  return values
}

export const listHabitats = sortListLayers(listValues)

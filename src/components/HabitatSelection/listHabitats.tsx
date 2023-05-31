const listValues = [
  {
    calcClass: 'Habitats',
    content: 'This calculation uses XXXXX...',
    calcNames: [
      {
        name: 'Number',
        url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc/JNCC_CEND1012_otherdata&calc=count&crs=epsg%3A4326&extension=csv&column=Habitat',
        layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
      },
      {
        name: 'Types - UKMarineHabitat',
        url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=first:FileName,first:FileFormat,count:Latitude&column=UKMarineHabitat',
        layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
      },
      {
        name: 'Types - Habitat',
        url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=sum:Area_seabed_m2,first:FileName,first:FileFormat,count:Latitude&column=Habitat',
        layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
      },
      {
        name: 'Types - EUNIS',
        url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=first:FileName,first:FileFormat,count:Latitude&column=EUNIS.Habitat',
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
        url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=count&crs=epsg%3A4326&extension=csv&column=Substratum',
        layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
      },
      {
        name: 'Types',
        url: '/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=agg&crs=epsg%3A4326&extension=csv&agg_columns=sum:Area_seabed_m2,first:FileName,first:FileFormat,count:Latitude&column=Substratum',
        layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
      },
    ],
  },
]

function sortListLayers(values: any[]) {
  return values
}

export const listHabitats = sortListLayers(listValues)

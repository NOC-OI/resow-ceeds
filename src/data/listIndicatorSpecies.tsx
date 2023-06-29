/* eslint-disable no-multi-str */

interface keyable {
  [key: string]: any
}

const JOSBaseUrl = import.meta.env.VITE_JASMIN_OBJECT_STORE_URL

const organisms: keyable = {
  pentapora_foliacea: [
    '*Pentapora foliacea*',
    `${JOSBaseUrl}haig-fras/output/M58_10441297_12987746513824.jpg`,
  ],
  galeus: [
    'Cartilagenous fish',
    `${JOSBaseUrl}haig-fras/output/M58_10441297_12987756293370.jpg`,
  ],
}
const listValues: any[] = [
  {
    calcClass: 'Sea pen',
    content:
      'JNCC lists sea pens as a Habitat Feature of Conservation Importance in the summary of \
    the Greater Haig Fras MPA (https://jncc.gov.uk/our-work/greater-haig-fras-mpa/). Note that sea pens \
    were not observed in seabed photographs captured during the autonomous underwater vehicle surveys',
    calcNames: [],
  },
  {
    calcClass: 'Species of conservation interest',
    content:
      'These are species of general interest for conservation in the area:  Pentapora foliacea, \
      Cartilagenous fish.',
    calcNames: [],
  },
]

Object.keys(organisms).forEach((organism: string) => {
  listValues[1].calcNames.push({
    name: organisms[organism][0],
    url: `v1/calc?filenames=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=organism&crs=epsg%3A4326&extension=csv&exclude_index=True&calc_columns=${organism}&agg_columns=first:filename,first:fileformat,sum:${organism},density:area_seabed_m2`,
    layers: {
      'Seabed Images': ['2012 AUV Image Survey'],
    },
    tableName: organism,
    noButton: true,
    decimalPlaces: 1,
    sampleImage: organisms[organism][1],
  })
})

function sortListLayers(values: any[]) {
  return values
}

export const listIndicatorSpecies = sortListLayers(listValues)

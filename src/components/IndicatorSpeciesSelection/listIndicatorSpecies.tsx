/* eslint-disable no-multi-str */
// const organisms = [
//   'Pentapora foliacea',
//   'Cartilagenous fish',
//   'Axinellidae_spp',
//   'Porella sp.',
//   'Parazoanthus sp.',
//   'Anthozoa_34',
//   'Anthozoa_39',
//   'Lepidorhombus whiffiagonis',
//   'Perciformes spp.10',
//   'Gadidae spp.',
//   'Paguridae_02',
//   'Bolocera spp.',
//   'Anthozoa_16',
//   'Cerianthid_01',
//   'Anthozoa_03',
//   'Porifera_20',
//   'Salamancina dysteri',
//   'Munida sp.',
//   'Echinus esculentus',
//   'Reteporella spp.',
//   'Stichastrrella rosea',
//   'Antedon spp.',
//   'Paguridae_01',
//   'Liocarcinus spp.',
//   'Hippoglossoides platessoides',
// ]

interface keyable {
  [key: string]: any
}
const organisms: keyable = {
  pentapora_foliacea: [
    '*Pentapora foliacea*',
    'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/output/M58_10441297_12987756293370_1.png',
  ],
  galeus: [
    'Cartilagenous fish',
    'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/output/M58_10441297_12987756293370_1.png',
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
    url: `/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=organism&crs=epsg%3A4326&extension=csv&exclude_index=True&column=${organism}&agg_columns=first:filename,first:fileformat,sum:${organism},density:area_seabed_m2`,
    layers: {
      'Seabed Images': ['2012 AUV Image Survey', 'JNCC CEND1012 Survey'],
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

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

const organisms = {
  pentapora_foliacea: 'Pentapora foliacea',
  galeus: 'Cartilagenous fish',
}

const calcNames: any[] = []
Object.keys(organisms).forEach((organism: any) => {
  calcNames.push({
    name: organisms[organism as keyof Object],
    url: `/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=organism&crs=epsg%3A4326&extension=csv&exclude_index=True&column=${organism}&agg_columns=first:filename,first:fileformat,sum:${organism}`,
    layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
    tableName: organism,
  })
})

const listValues = [
  {
    calcClass: 'Species of interest',
    content: 'This calculation uses XXXXX...',
    calcNames,
  },
]

function sortListLayers(values: any[]) {
  return values
}

export const listIndicatorSpecies = sortListLayers(listValues)

// // const organisms = [
// //   'Pentapora foliacea',
// //   'Cartilagenous fish',
// //   'Axinellidae_spp',
// //   'Porella sp.',
// //   'Parazoanthus sp.',
// //   'Anthozoa_34',
// //   'Anthozoa_39',
// //   'Lepidorhombus whiffiagonis',
// //   'Perciformes spp.10',
// //   'Gadidae spp.',
// //   'Paguridae_02',
// //   'Bolocera spp.',
// //   'Anthozoa_16',
// //   'Cerianthid_01',
// //   'Anthozoa_03',
// //   'Porifera_20',
// //   'Salamancina dysteri',
// //   'Munida sp.',
// //   'Echinus esculentus',
// //   'Reteporella spp.',
// //   'Stichastrrella rosea',
// //   'Antedon spp.',
// //   'Paguridae_01',
// //   'Liocarcinus spp.',
// //   'Hippoglossoides platessoides',
// // ]

// const organisms = {
//   pentapora_foliacea: ['Pentapora foliacea', 'This organism uses XXXXX...'],
//   galeus: ['Cartilagenous fish', 'This organism uses XXXXX...'],
// }

// const listValues: any[] = []

// Object.keys(organisms).forEach((organism: any) => {
//   listValues.push({
//     calcClass: organisms[organism as keyof Object][0],
//     content: organisms[organism as keyof Object][1],
//     calcName: [
//       {
//         name: 'Number of Specimens',
//         url: `/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=organism&crs=epsg%3A4326&extension=csv&exclude_index=True&column=${organism}&agg_columns=first:filename,first:fileformat,sum:${organism}`,
//         layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
//         tableName: organism,
//       },
//       {
//         name: 'Density',
//         url: `/data?filename=output:HF2012_alltile_otherdata,output:HF2012_alltile_counts,jncc:JNCC_CEND1012_otherdata&calc=organism&crs=epsg%3A4326&extension=csv&exclude_index=True&column=${organism}&agg_columns=first:filename,first:fileformat,sum:${organism}`,
//         layers: { 'Seabed Images': ['AUV 2012', 'JNCC 1012'] },
//         tableName: organism,
//       },
//     ],
//   })
// })

// function sortListLayers(values: any[]) {
//   return values
// }

// export const listIndicatorSpecies = sortListLayers(listValues)

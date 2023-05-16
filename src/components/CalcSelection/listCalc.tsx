let listValues = [{
  calcClass: 'Habitats',
  content: 'This calculation uses XXXXX...',
  calcNames: [
    {
      name: 'Habitats',
      url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count,unique&crs=epsg%3A4326&extension=csv&column=Habitat',
    },
    {
      name: 'Substrates',
      url: '/data?filename=HF2012_other_data,HF2012_annotation_summary&calc=count,unique&crs=epsg%3A4326&extension=csv&column=Substratum',
    },
  ]
},
{
  calcClass: 'Biodiversity Monitoring',
  content: 'This calculation uses XXXXX...',
  calcNames: [
    {
      name: 'Indicator Species',
      url: '/data?filename=clipped_haigfras_biozones&calc=unique',
    },
    {
      name: 'Biodiversity',
      url: '/data?filename=clipped_haigfras_biozones&calc=unique',
    },
    {
      name: 'Community Analisys',
      url: '/data?filename=clipped_haigfras_biozones&calc=unique',
    },
  ]
},
{
  calcClass: 'Survey design',
  content: 'This calculation uses XXXXX...',
  calcNames: [
    {
      name: 'Temporal representation',
      url: '/data?filename=clipped_haigfras_biozones&calc=unique',
    },
    {
      name: 'Spatial representation',
      url: '/data?filename=clipped_haigfras_biozones&calc=unique',
    },
    {
      name: 'Habitat representation',
      url: '/data?filename=clipped_haigfras_biozones&calc=unique',
    },
    {
      name: 'Biodiversity representation',
      url: '/data?filename=clipped_haigfras_biozones&calc=unique',
    },
  ]
},
{
  calcClass: 'Habitat mapping',
  content: 'This calculation uses XXXXX...',
  calcNames: [
    {
      name: 'XXXXX',
      url: '/data?filename=haigfras_classification&calc=count&column=all&extension=ddgeoparquet',
    },
  ]
}];

function sortListLayers(listCalcs: any[]){
  return listCalcs
}

export const listCalcs = sortListLayers(listValues)

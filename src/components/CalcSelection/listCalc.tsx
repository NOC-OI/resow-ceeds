let listValues = [{
  calcClass: 'Habitats',
  calcNames: [
    {
      name: 'Assumptions/constraints',
      url: '/data?filename=clipped_haigfras_biozones&calc=count',
    },
    {
      name: 'Habitats',
      url: '/data?filename=clipped_haigfras_biozones&calc=unique',
    },
    {
      name: 'Substrats',
      url: '/data?filename=clipped_haigfras_biozones&calc=unique',
    },
  ]
},
{
  calcClass: 'Biodiversity Monitoring',
  calcNames: [
    {
      name: 'Assumptions/constraints',
      url: '/data?filename=clipped_haigfras_biozones&calc=count',
    },
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
  calcNames: [
    {
      name: 'Assumptions/constraints',
      url: '/data?filename=clipped_haigfras_biozones&calc=count',
    },
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
  calcNames: [
    {
      name: 'XXXXX',
      url: '/data?filename=haigfras_classification&calc=count&column=all&extension=ddgeoparquet',
    },
  ]
},
{
  calcClass: 'Data explotation',
  calcNames: [
    {
      name: 'Bathymetry',
      url: '/data?filename=haigfras_classification&calc=count&column=all&extension=ddgeoparquet',
    },
    {
      name: 'Seabed images (AUV)',
      url: '/data?filename=haigfras_classification&calc=unique&column=all&extension=ddgeoparquet',
    },
  ]
},
{
  calcClass: 'Biozones',
  calcNames: [
    {
      name: 'Number of Biozones',
      url: '/data?filename=clipped_haigfras_biozones&calc=count',
    },
    {
      name: 'Names of Biozones',
      url: '/data?filename=clipped_haigfras_biozones&calc=unique',
    },
  ]
},
{
  calcClass: 'Classification',
  calcNames: [
    {
      name: 'Number of Zones',
      url: '/data?filename=haigfras_classification&calc=count&column=all&extension=ddgeoparquet',
    },
    {
      name: 'Names of Zones',
      url: '/data?filename=haigfras_classification&calc=unique&column=all&extension=ddgeoparquet',
    },
  ]
}];

function sortListLayers(listCalcs: any[]){
  return listCalcs
}

export const listCalcs = sortListLayers(listValues)

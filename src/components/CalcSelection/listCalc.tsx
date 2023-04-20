let listValues = [{
  calcClass: 'Biozones',
  calcNames: {
    calc1: {
      name: 'Number of Biozones',
      url: '/data?filename=clipped_haigfras_biozones&calc=count',
    },
    calc2: {
      name: 'Names of Biozones',
      url: '/data?filename=clipped_haigfras_biozones&calc=unique',
    },
  }
},
{
  calcClass: 'Classification',
  calcNames: {
    calc1: {
      name: 'Number of Zones',
      url: '/data?filename=haigfras_classification&calc=count&column=all&extension=ddgeoparquet',
    },
    calc2: {
      name: 'Names of Zones',
      url: '/data?filename=haigfras_classification&calc=unique&column=all&extension=ddgeoparquet',
    },
  }
}];

function sortListLayers(listCalcs: any[]){
  return listCalcs
}

export const listCalcs = sortListLayers(listValues)

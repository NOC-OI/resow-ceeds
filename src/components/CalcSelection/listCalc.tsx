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
}];

function sortListLayers(listCalcs: any[]){
  return listCalcs
}

export const listCalcs = sortListLayers(listValues)

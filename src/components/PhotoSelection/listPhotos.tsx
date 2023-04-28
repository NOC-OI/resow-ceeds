let listValues = [{
  layerClass: 'Seabed Images',
  layerNames: {
    2012: {
      data_type: 'Photo',
      photos: [
        {
          url: 'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/output/output_raster_cog.tif',
          low_res_url: 'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/output/output_raster_cog.png',
          local_data_type: 'Marker-COG',
          description: 'Photo 1 2012',
          title: 'Seabed',
          active: false,
          id: 1,
        },
        {
          url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987749054970_1.tif',
          low_res_url: 'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987749054970_1.png',
          local_data_type: 'Marker-COG',
          description: 'Photo 2 2012',
          title: 'Seabed',
          active: false,
          id: 2,
        },
        {
          url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987749390121_1.tif',
          low_res_url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987749390121_1.png',
          local_data_type: 'Marker-COG',
          description: 'Photo 3 2012',
          title: 'Seabed',
          active: false,
          id: 3,
        },
        {
          url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987755746830_1.tif',
          low_res_url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987755746830_1.png',
          local_data_type: 'Marker-COG',
          description: 'Photo 4 2012',
          title: 'Seabed',
          active: false,
          id: 4,
        },
        {
          url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987757649461_1.tif',
          low_res_url:  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/cog_rep_M58_10441297_12987757649461_1.png',
          local_data_type: 'Marker-COG',
          description: 'Photo 5 2012',
          title: 'Seabed',
          active: false,
          id: 5,
        }
      ],
    }
  },
}]

function sortListLayers(listLayers: any[]){
  let sortedList: string[] = []
  listLayers.forEach(listLayer => {
    sortedList.push(listLayer.layerClass)
  })
  sortedList.sort()
  let newSortedList: any[] = []
  sortedList.forEach(sorted => {
    listLayers.forEach(listLayer => {
      if (sorted === listLayer.layerClass){
        newSortedList.push(listLayer)
      }
    })
  })
  return newSortedList
}

export const listPhotos = sortListLayers(listValues)

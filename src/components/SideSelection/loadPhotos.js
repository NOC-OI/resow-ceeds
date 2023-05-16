export class GetPhotos {
    constructor () {
        this.data = null
        this.photos = null
    }

    async logJSONData() {
        await fetch('https://haigfras-api.herokuapp.com/csv?filenames=HF2012_other_data,HF2012_annotation_summary&columns=active:False,local_data_type:Marker-COG,show:True')
        .then(response => response.json())
        .then(jsonData => {
            this.photos = jsonData
            this.data = [{ 
                layerClass: 'Seabed Images',
                layerNames: {
                    2012: {
                        data_type: 'Photo',
                        photos: jsonData
                    }
                }
            }]
        })
    }

    async loadCSV() {
        await this.logJSONData()
    }
}

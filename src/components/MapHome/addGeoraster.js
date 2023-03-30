export class GetCOGLayer {
  constructor (layerName, actualLayer) {
    this.layerBame = layerName
    this.actualLayer = actualLayer
    this.url = layerName.url
    this.layer = null
  }

  async parseGeo() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    console.log("start search image")
    await parseGeoraster(this.url).then(async (georaster) => {
      console.log("end search image")
      this.layer = new GeoRasterLayer({
        georaster: georaster,
        attribution: this.actualLayer,
        resolution: 256,
        opacity: 0.7,
        keepBuffer: 25,
        debugLevel: 1,
        // mask: continent,
        // mask_strategy: "inside"
        // pixelValuesToColorFn: values => {
        //   console.log(values)
        //   return values[0] ? '#00000000' : values[0]
        // }
      });
    });
    console.log("end create cog layer")
  }
}

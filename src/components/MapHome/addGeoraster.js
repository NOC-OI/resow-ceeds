export class GetCOGLayer {
  constructor (layerName) {
    this.layerBame = layerName
    this.url = layerName.url
    this.layer = null
  }

  async parseGeo() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    await parseGeoraster(this.url).then(async (georaster) => {
      this.layer = new GeoRasterLayer({
        georaster: georaster,
        resolution: 128,
        opacity: 1,
        keepBuffer: 25,
        debugLevel: 0,
        // mask: continent,
        // mask_strategy: "inside"
        // pixelValuesToColorFn: values => {
        //   console.log(values)
        //   return values[0] ? '#00000000' : values[0]
        // }
      });
    });
  }
}

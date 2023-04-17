import chroma from "chroma-js";
import axios from 'axios';
import { parse, stringify } from 'qs'
import 'leaflet/dist/leaflet';


export class GetCOGLayer {
  constructor (layerName, actualLayer) {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.url = layerName.url
    this.layer = null
  }

  async parseGeo() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    const scale = chroma.scale(['white', 'black']).domain([-11022, 0]);

    await parseGeoraster(this.url).then(async (georaster) => {
      // const options = { left: 0, top: 0, right: 4000, bottom: 4000, width: 10, height: 10 };
      // georaster.getValues(options).then(values => {
      //   console.log("clipped values are", values);
      // });
      this.layer = new GeoRasterLayer({
        georaster: georaster,
        attribution: this.actualLayer[0],
        resolution: 256,
        opacity: 0.7,
        keepBuffer: 25,
        debugLevel: 0,
        // pixelValuesToColorFn: function (values) {
        //   const elevation = values[0];
        //   if (elevation > 0) return "rgba(34, 15, 50,0)";
        //   return scale(elevation).hex();
        // }
        // mask: continent,
        // mask_strategy: "inside"
      });
    });
  }
}


export class GetTifLayer {
  constructor (url, actualLayer) {
    this.actualLayer = actualLayer
    this.url = url
    this.layer = null
    this.georaster = null
  }

  async parseGeo() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    // const scale = chroma.scale(['white', 'black']).domain([-11022, 0]);

    await fetch(this.url)
    .then(async response => await response.arrayBuffer())
    .then(async arrayBuffer => {
      await parseGeoraster(arrayBuffer).then(async georaster => {
        const min = georaster.mins[0];
        const max = georaster.maxs[0];
        const range = georaster.ranges[0];
        // var scale = chroma.scale("Viridis");
        this.georaster = georaster
        this.layer = await new GeoRasterLayer({
          georaster: georaster,
          opacity: 0,
          // pixelValuesToColorFn: function(pixelValues) {
          //   var pixelValue = pixelValues[0]; // there's just one band in this raster

          //   // if there's zero wind, don't return a color
          //   if (pixelValue === 0) return null;

          //   // scale to 0 - 1 used by chroma
          //   var scaledPixelValue = (pixelValue - min) / range;

          //   var color = scale(scaledPixelValue).hex();

          //   return color;
          // },
          resolution: 64
        });
      });
    });
  }
}


export class GetTileLayer {
  constructor (layerName, actualLayer) {
    this.layerBame = layerName
    this.actualLayer = actualLayer
    this.url = layerName.url
    this.layer = null
    this.colourScheme = 'gray'
    this.bounds = null
  }

  async getTile() {
    const TITILER_URL = import.meta.env.VITE_TITILER_URL;

    const cogInfo = await axios.get(`${TITILER_URL}/cog/info?url=${encodeURIComponent(this.url)}`).then(r => r.data)
    const cogStats = await axios.get(`${TITILER_URL}/cog/statistics?url=${encodeURIComponent(this.url)}`).then(r => r.data)

    this.bounds = cogInfo.bounds

    const bands = []
    for (let i = 0; i < cogInfo.band_descriptions.length; i++) {
      bands.push(cogInfo.band_descriptions[i][0])
    }
    let bidx = [1]
    if (bands.length >= 3) {
      bidx = [1, 2, 3]
    }

    const rescale = []
    for (let i = 0; i < bands.length; i++) {
      const stats = cogStats[bands[i]]
      rescale.push(`${stats.percentile_2},${stats.percentile_98}`)
    }

    const url = this.url
    const args = {
      bidx: bidx.length === 1 ? bidx[0] : bidx,
      rescale: rescale.length === 1 ? rescale[0] : rescale,
      url
    }

    const tileJson = await axios.get(
      `${TITILER_URL}/cog/WebMercatorQuad/tilejson.json`,
      {
        params: args,
        paramsSerializer: {
          encode: params => parse(params),
          serialize: params => stringify(params, { arrayFormat: 'repeat' })
        }
      }
    ).then(r => r.data)

    let tileUrl = tileJson.tiles[0]
    if (bands.length === 1) {
      tileUrl += `&colormap_name=${this.colourScheme}`
    }


    this.layer = L.tileLayer( tileUrl, {
      opacity: 1.0,
      maxZoom: 30,
      attribution: this.actualLayer[0],
      limits: this.bounds
    })
  }
}

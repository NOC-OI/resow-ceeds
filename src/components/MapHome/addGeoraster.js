/* eslint-disable no-undef */
// import chroma from 'chroma-js'
import axios from 'axios'
import { parse, stringify } from 'qs'
import 'leaflet/dist/leaflet'
import * as Cesium from 'cesium'

export class GetCOGLayer {
  constructor(layerName, actualLayer) {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.url = layerName.url
    this.layer = null
  }

  async parseGeo() {
    const JOSBaseUrl = process.env.VITE_JASMIN_OBJECT_STORE_URL

    this.url = `${JOSBaseUrl}${this.url}`

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    // const scale = chroma.scale(['white', 'black']).domain([-11022, 0])

    // await fetch(this.url)
    // .then(async response => await response.arrayBuffer())
    // .then(async arrayBuffer => {
    //   await parseGeoraster(arrayBuffer).then(async georaster => {
    //     this.layer = new GeoRasterLayer({
    //       georaster: georaster,
    //       attribution: this.actualLayer,
    //       resolution: 256,
    //       opacity: 0.7,
    //       debugLevel: 0,
    //       // pixelValuesToColorFn: function (values) {
    //       //   const elevation = values[0];
    //       //   if (elevation > 0) return "rgba(34, 15, 50,0)";
    //       //   return scale(elevation).hex();
    //       // }
    //       // mask: continent,
    //       // mask_strategy: "inside"
    //     });
    //   })
    // })
    await parseGeoraster(this.url).then(async (georaster) => {
      // const options = { left: 0, top: 0, right: 4000, bottom: 4000, width: 10, height: 10 };
      // georaster.getValues(options).then(values => {
      //   console.log("clipped values are", values);
      // });
      this.layer = new GeoRasterLayer({
        georaster,
        attribution: this.actualLayer,
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
      })
    })
  }
}

export class GetTifLayer {
  constructor(url, actualLayer, resolution = 64) {
    this.actualLayer = actualLayer
    this.url = url
    this.layer = null
    this.georaster = null
    this.resolution = resolution
  }

  async parseGeo() {
    // const scale = chroma.scale(['white', 'black']).domain([-11022, 0]);

    await fetch(this.url)
      .then(async (response) => await response.arrayBuffer())
      .then(async (arrayBuffer) => {
        await parseGeoraster(arrayBuffer).then(async (georaster) => {
          // const min = georaster.mins[0]
          // const max = georaster.maxs[0]
          // const range = georaster.ranges[0]
          // var scale = chroma.scale("Viridis");
          this.georaster = georaster
          this.layer = await new GeoRasterLayer({
            georaster,
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
            resolution: this.resolution,
          })
        })
      })
  }
}

export class GetTileLayer {
  constructor(layerName, actualLayer, contrast, dataType = 'COG') {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.url = layerName.url
    this.dataType = dataType
    this.layer = null
    this.colourScheme = 'gray'
    this.bounds = null
    this.popupText = ''
    this.position = null
    this.rescale = []
    this.args = null
    this.tileJson = null
    this.tileUrl = null
    this.contrast = contrast
    this.error = null
  }

  async getTile(rout) {
    const TILE_SERVER_URL = process.env.VITE_TILE_SERVER_URL
    const JOSBaseUrl = process.env.VITE_JASMIN_OBJECT_STORE_URL

    this.url = `${JOSBaseUrl}${this.url}`

    const newUrl = this.layerName.signed_url
      ? this.layerName.signed_url
      : this.url
    const isUrlEncoded = !!this.layerName.signed_url

    const cogInfo = await axios
      .get(
        `${TILE_SERVER_URL}cog/info?url=${encodeURIComponent(
          newUrl,
        )}&encoded=${isUrlEncoded}`,
      )
      .then((r) => r.data)
      .catch((error) => {
        return error.response.status
      })

    if (cogInfo === 500) {
      this.error = 'You do not have authorization to access this file'
      return
    }
    const cogStats = await axios
      .get(
        `${TILE_SERVER_URL}cog/statistics?url=${encodeURIComponent(
          newUrl,
        )}&encoded=${isUrlEncoded}`,
      )
      .then((r) => r.data)

    this.bounds = cogInfo.bounds
    if (this.dataType === 'marker') {
      this.icon = L.icon({
        iconUrl: '/marker-icon.png',
        // shadowUrl: '/marker-shadow.png',
        iconSize: [27, 45],
      })

      this.position = [
        (this.bounds[3] + this.bounds[1]) / 2,
        (this.bounds[2] + this.bounds[0]) / 2,
      ]
      this.layer = L.marker(
        [
          (this.bounds[3] + this.bounds[1]) / 2,
          (this.bounds[2] + this.bounds[0]) / 2,
        ],
        {
          riseOnHover: true,
          autoPanOnFocus: false,
          icon: this.icon,
        },
      )
      this.popupText = `
        <b>${this.actualLayer}</b><br>
        CEDA: XXXXXXXX<br>
        TILE NUMBER:<em>10</em><br>
        TOTAL AREA OF SURVEY:<em>2km²</em><br>
        EXTENT OF SURVEY:<em>100m</em><br>
        HABITAT:<em>XXXX</em><br>
        SUBSTRATE:<em>XXXX</em><br>
        iFDO SUMMARY:<em>XXXX</em><br>
        <em>XXXXX</em><br>
        <em>XXXXX</em><br>
      `
      this.layer.options.attribution = this.actualLayer
      this.layer.options.url = this.url
      this.layer.options.dataType = this.dataType
    } else {
      const bands = []
      for (let i = 0; i < cogInfo.band_descriptions.length; i++) {
        bands.push(cogInfo.band_descriptions[i][0])
      }
      let bidx = [1]
      if (bands.length >= 3) {
        bidx = [1, 2, 3]
      }

      // let bidx = []
      // bands.forEach((band, idx) => {
      //   bidx.push(idx+1)
      // })
      for (let i = 0; i < bands.length; i++) {
        const stats = cogStats[bands[i]]
        if (this.contrast) {
          stats
            ? this.rescale.push(`${stats.percentile_2},${stats.percentile_98}`)
            : this.rescale.push('0,255')
        } else {
          // stats? rescale.push(`0,${stats.percentile_98}`): rescale.push('0,255')
          this.rescale.push('0,255')
        }
      }

      // const rescale = []
      // for (let i = 0; i < bands.length; i++) {
      //   const stats = cogStats[bands[i]]
      //   stats? rescale.push('0,255'): rescale.push('0,255')
      // }
      // console.log(cogStats)

      const url = newUrl
      this.args = {
        bidx: bidx.length === 1 ? bidx[0] : bidx,
        rescale: this.rescale.length === 1 ? this.rescale[0] : this.rescale,
        url,
        encoded: isUrlEncoded,
      }
      this.tileJson = await axios
        .get(`${TILE_SERVER_URL}cog/WebMercatorQuad/tilejson.json`, {
          params: this.args,
          paramsSerializer: {
            encode: (params) => parse(params),
            serialize: (params) => stringify(params, { arrayFormat: 'repeat' }),
          },
        })
        .then((r) => r.data)
      this.tileUrl = this.tileJson.tiles[0]
      if (bands.length === 1) {
        this.tileUrl += `&colormap_name=${this.colourScheme}`
      }
      if (rout === '/3d') {
        // this.tileUrl = this.tileUrl.replace('/{z}/{x}/{y}@1x', '')
        // this.tileUrl += '&format=png'
        // const rectangle = new Cesium.Rectangle(
        //   Cesium.Math.toRadians(this.bounds[0]),
        //   Cesium.Math.toRadians(this.bounds[1]),
        //   Cesium.Math.toRadians(this.bounds[2]),
        //   Cesium.Math.toRadians(this.bounds[3]),
        // )
        // console.log(this.tileUrl)
        // this.layer = new Cesium.WebMapTileServiceImageryProvider({
        //   url: this.tileUrl,
        //   maximumLevel: 30,
        //   rectangle,
        // })
        // const rectangleSouthwestInMeters = Cesium.Cartesian3.fromDegrees(
        //   this.bounds[2],
        //   this.bounds[1],
        // )
        // const rectangleNortheastInMeters = Cesium.Cartesian3.fromDegrees(
        //   this.bounds[0],
        //   this.bounds[3],
        // )
        // this.layer = await Cesium.TileMapServiceImageryProvider.fromUrl(
        //   this.tileUrl,
        //   {
        //     fileExtension: 'png',
        //     maximumLevel: 30,
        //     rectangle,
        //     url: this.url,
        //     // tilingScheme: new Cesium.WebMercatorTilingScheme({
        //     //   rectangleSouthwestInMeters: Cesium.Cartesian2.fromCartesian3(
        //     //     rectangleSouthwestInMeters,
        //     //   ),
        //     //   rectangleNortheastInMeters: Cesium.Cartesian2.fromCartesian3(
        //     //     rectangleNortheastInMeters,
        //     //   ),
        //     // }),
        //   },
        // )
        // this.layer = new Cesium.Cesium3DTileset({
        //   url: this.tileUrl,
        // })
        // this.layer = new Cesium.UrlTemplateImageryProvider({
        //   url: this.tileUrl,
        // })

        this.layer = new Cesium.ImageryLayer(
          new Cesium.UrlTemplateImageryProvider({
            url: this.tileUrl,
          }),
          {},
        )
        this.layer.attribution = this.actualLayer
        this.layer.dataType = this.dataType
      } else {
        this.layer = L.tileLayer(this.tileUrl, {
          opacity: 0.7,
          maxZoom: 30,
          attribution: this.actualLayer,
          url: this.url,
          limits: this.bounds,
        })
      }
    }
  }
}

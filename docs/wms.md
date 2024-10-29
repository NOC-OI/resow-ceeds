# WMS Layers

This guide will walk you through the process of loading Web Map Service (WMS) layers in a React application using React-Leaflet for 2D maps and Resium for 3D maps. WMS is a standard protocol for serving georeferenced map images over the internet.

Web Mapping Services from the following institutions are being accessed to add layers to the map:
- JNCC: [https://jncc.gov.uk/our-work/marine-protected-area-mapper/](https://jncc.gov.uk/our-work/marine-protected-area-mapper/)
- EMODNET: [https://emodnet.ec.europa.eu/en/emodnet-web-service-documentation](https://emodnet.ec.europa.eu/en/emodnet-web-service-documentation)

## Loading WMS Layers with React-Leaflet

1. **Import Required Modules**

    Import the necessary modules in your `WMSLayer.js` file:

    ```tsx
    import React from 'react';
    import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
    ```

2. **Define the WMS Layer**

    Define the WMS layer within your component, specifying the URL, layers, and other options:

    ```tsx
    export function WMSLayer(){
      return (
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <WMSTileLayer
            url="URL_TO_YOUR_WMS_SERVICE"
            layers="LAYER_NAME"
            format="image/png"
          />
        </MapContainer>
      );
    };

3. **Use the Component**

    Import and use your `WMSLayer` component in your main application file:

    ```tsx
    import React from 'react';
    import { WMSLayer } from './WMSLayer';

    export function App() {
      return (
        <div>
          <WMSLayer />
        </div>
      );
    }

    export default App;
    ```

## Loading WMS Layers with Resium (3D Maps)

1. **Import Required Modules**

    ```tsx
    import React from 'react';
    import { Viewer, ImageryLayer } from 'resium';
    import Cesium from 'cesium';
    ```

2. **Define the WMS Layer**

    Define the WMS layer within your component:

    ```tsx
    export function WMSLayer(){
      return (
        <Viewer full>
          <ImageryLayer
            imageryProvider={new Cesium.WebMapServiceImageryProvider({
              url: 'URL_TO_YOUR_WMS_SERVICE',
              layers: 'LAYER_NAME',
            })}
          />
        </Viewer>
      );
    };
    ```
# Cesium Ion 3D Layers

This guide will take you through the process of opening Cesium Ion 3D layers in a React TypeScript (TSX) application using Resium. Cesium Ion is a cloud-based platform for creating, hosting, and streaming 3D geospatial content, while Resium is a library for integrating Cesium 3D globes with React.

## Configuring Cesium Ion

1. **Sign Up for Cesium Ion**

Before you can use Cesium Ion, you need to create an account on [Cesium Ion](https://cesium.com/ion/). Once you have an account, you can obtain your access token.

2. **Set Your Access Token**

Add your Access Token value to the .env file:

```bash
VITE_CESIUM_TOKEN=
```

In the tsx file, set your Cesium Ion access token by including the following code in your application's entry point (e.g., `index.tsx`):

```tsx
import { Ion } from 'cesium'

Ion.defaultAccessToken = process.env.VITE_CESIUM_TOKEN
```

## Opening a Cesium Ion 3D Layer

1. **Import Required Modules**

Import the necessary modules:

```tsx
import React from 'react';
import { Viewer } from 'resium';
```

2. **Define the Cesium Ion Layer**

Define the Cesium Ion layer within your component:

```tsx
const assetId = 'ASSET ID FROM THE CESIUM ION ACCOUNT'
const terrainUrl = await Cesium.CesiumTerrainProvider.fromIonAssetId(
  assetId,
)
ref.current.cesiumElement.terrainProvider = terrainUrl
```

Please note that you will need to replace `'ASSET ID FROM THE CESIUM ION ACCOUNT'` with the actual asset ID you want to use from your Cesium Ion account.
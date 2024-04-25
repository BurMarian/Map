import React, { useState } from 'react';

// Libs
import {
  Marker,
  Layer,
  Source,
  Map as ReactMapGl,
  ViewState,
} from 'react-map-gl';

// Interfaces
import { ILocation } from './types';

// Constants
import { CLUSTERS } from './Map.constants';

export function Map() {
  const [newPlace, setNewPlace] = useState<ILocation | null>(null);

  const initMap: Partial<ViewState> = {
    latitude: 49.842957,
    longitude: 24.031111,
    zoom: 8,
  };

  return (
    <ReactMapGl
      initialViewState={initMap}
      mapboxAccessToken={process.env.REACT_APP_TOKEN}
      mapStyle={'mapbox://styles/burbanm/clvf1j04z013701qp23l092n9'}
      style={{ height: '100vh', width: '100vw' }}
      onClick={(e) => {
        setNewPlace({
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
        });
      }}
    >
      {/* clusters */}
      <Source
        type="geojson"
        data={'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'}
        cluster={true}
        clusterRadius={80}
        clusterProperties={CLUSTERS}
      >
        <Layer
          id="earthquake_circle"
          type="circle"
          source="earthquakes"
          filter={['!=', 'cluster', true]}
          paint={{
            'circle-color': 'red',
            'circle-opacity': 0.6,
            'circle-radius': 12,
          }}
        />
        <Layer
          id="earthquake_label"
          type="symbol"
          source="earthquakes"
          filter={['!=', 'cluster', true]}
          layout={{
            'text-field': [
              'number-format',
              ['get', 'mag'],
              { 'min-fraction-digits': 1, 'max-fraction-digits': 1 },
            ],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-size': 10,
          }}
          paint={{
            'text-color': ['case', ['<', ['get', 'mag'], 3], 'black', 'white'],
          }}
        />
      </Source>

      {/* marker */}
      {newPlace ? (
        <Marker
          latitude={newPlace?.lat}
          longitude={newPlace?.lng}
          color="orange"
          draggable
        ></Marker>
      ) : null}
    </ReactMapGl>
  );
}

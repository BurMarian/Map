/* eslint-disable no-empty */
import React, { useEffect, useState } from 'react';

// Libs
import {
  Marker,
  Layer,
  Source,
  Map as ReactMapGl,
  ViewState,
} from 'react-map-gl';

// Interfaces
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { ILocation } from '../../interfaces';

// Api
import { markerAPI } from '../../api/map.api';

// Constants
import { CLUSTERS } from './Map.constants';
import { Backdrop } from '../Backdrop/Backdrop';

export function Map() {
  const [newPlace, setNewPlace] = useState<ILocation | null>(null);
  const [markers, setMarkers] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);
  const [loading, setLoading] = useState(false);

  const initMap: Partial<ViewState> = {
    latitude: 49.842957,
    longitude: 24.031111,
    zoom: 8,
  };

  useEffect(() => {
    if (newPlace) {
      const createMarker = async () => {
        setLoading(true);
        try {
          const res = await markerAPI.addMarker(newPlace);
          setMarkers((prev) => [...prev, res as any]);
        } catch (error) {
          // handle error
        }

        setLoading(false);
      };
      createMarker();
    }
  }, [newPlace]);

  useEffect(() => {
    const getMarkersFunc = async () => {
      setLoading(true);
      const res = await markerAPI.getMarkers();
      setMarkers(res);
      setLoading(false);
    };
    getMarkersFunc();
  }, []);

  // main test commit

  const handleMarkerDelete = async (e: any) => {
    setLoading(true);
    try {
      const res = await markerAPI.deleteMarker(
        e.target.getLngLat() as ILocation,
      );
      setMarkers((prev) => prev.filter((mark) => mark.id !== res));
    } catch (error) {
      // handle error
    }
    setLoading(false);
  };

  // dev test commit 2

  return (
    <ReactMapGl
      initialViewState={initMap}
      mapboxAccessToken={process.env.REACT_APP_TOKEN}
      mapStyle={'mapbox://styles/burbanm/clvf1j04z013701qp23l092n9'}
      style={{ height: '100vh', width: '100vw' }}
      onDblClick={(e) => {
        setNewPlace({
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
        });
      }}
    >
      {loading ? (
        <Backdrop />
      ) : (
        <>
          {/* clusters */}
          <Source
            type="geojson"
            data={
              'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
            }
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
                'text-color': [
                  'case',
                  ['<', ['get', 'mag'], 3],
                  'black',
                  'white',
                ],
              }}
            />
          </Source>

          {/* marker */}
          {markers.map((marker, index) => {
            return (
              <Marker
                key={index}
                latitude={marker?.data()?.lat}
                longitude={marker?.data()?.lng}
                color="orange"
                draggable
                style={{
                  cursor: 'pointer',
                }}
                onClick={handleMarkerDelete}
              ></Marker>
            );
          })}
        </>
      )}
    </ReactMapGl>
  );
}

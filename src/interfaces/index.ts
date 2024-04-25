// Interfaces
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { LngLat } from 'mapbox-gl';

export interface ILocation {
  lat: LngLat['lat'];
  lng: LngLat['lng'];
}

// firebase
export interface IFirebase<T> extends QueryDocumentSnapshot<T> {}

// Interfaces
import { QueryDocumentSnapshot } from 'firebase/firestore';

export interface ILocation {
  lat: number;
  lng: number;
}

// firebase
export interface IFirebase<T> extends QueryDocumentSnapshot<T> {}

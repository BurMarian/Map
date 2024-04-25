// Configs
import { db } from '../configs/firebase.config';

// Constants
import { FIREBASE_COLLECTIONS } from '../constants/map.contant';

// Interfaces
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { IFirebase, ILocation } from '../interfaces';

export const markerAPI = {
  // get
  async getMarkers() {
    const querySnapshot = await getDocs(
      collection(db, FIREBASE_COLLECTIONS.markers),
    );
    return querySnapshot.docs;
  },

  async getMarker(location: ILocation) {
    const querySnapshot = await getDocs(
      collection(db, FIREBASE_COLLECTIONS.markers),
    );
    return querySnapshot.docs.find(
      (doc) =>
        doc.data().lat === location.lat && doc.data().lng === location.lng,
    );
  },

  // add
  async addMarker(location: ILocation) {
    return await addDoc(collection(db, FIREBASE_COLLECTIONS.markers), location);
  },

  // update
  async updateMarker(prevLocation: ILocation, newLocation: ILocation) {
    const marker = await this.getMarker(prevLocation);

    if (marker) {
      return await updateDoc(doc(db, FIREBASE_COLLECTIONS.markers, marker.id), {
        ...newLocation,
      });
    }
  },

  // delete
  async deleteMarker(location: ILocation) {
    const marker = await this.getMarker(location);
    marker?.id &&
      (await deleteDoc(doc(db, FIREBASE_COLLECTIONS.markers, marker?.id)));
  },
};

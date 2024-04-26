// Configs
import { db, fb } from '../configs/firebase.config';

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
  updateDoc,
} from 'firebase/firestore';
import { ILocation } from '../interfaces';

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
    const addedMarker = await addDoc(
      collection(db, FIREBASE_COLLECTIONS.markers),
      {
        ...location,
        createdAt: fb.Timestamp.now(),
        updatedAt: fb.Timestamp.now(),
      },
    );
    const docRef = doc(db, FIREBASE_COLLECTIONS.markers, addedMarker.id);
    const docSnap = await getDoc(docRef);

    if (docSnap) {
      return docSnap;
    }
  },

  // update
  async updateMarker(prevLocation: ILocation, newLocation: ILocation) {
    const marker = await this.getMarker(prevLocation);

    if (marker) {
      return await updateDoc(doc(db, FIREBASE_COLLECTIONS.markers, marker.id), {
        ...newLocation,
        updatedAt: fb.Timestamp.now(),
      });
    }
  },

  // delete
  async deleteMarker(location: ILocation) {
    const marker = await this.getMarker(location);
    if (marker?.id) {
      await deleteDoc(doc(db, FIREBASE_COLLECTIONS.markers, marker?.id));
      return marker?.id;
    }
  },
};

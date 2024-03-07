import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FireStore } from '../models/firestore-model';

@Injectable({
  providedIn: 'root'
})
export class FireStoreService {
  
  fireStoreRef: AngularFirestoreCollection<FireStore>;

  constructor(private db: AngularFirestore) {
    // this.fireStoreRef = db.collection('/consultantOnlineStatus');
  }

  getAll(collectionName: string): AngularFirestoreCollection<FireStore> {
    this.fireStoreRef = this.db.collection(collectionName);
    return this.fireStoreRef;
  }

  create(id: any, collectionName: any, firStore: FireStore): any {
    // return this.fireStoreRef.add({ ...firStore });
    this.fireStoreRef = this.db.collection(collectionName);
    return this.fireStoreRef.doc(id).set({ ...firStore });
  }

  update(id: any, data: any, collectionName: string): Promise<void> {
    this.fireStoreRef = this.db.collection(collectionName);
    return this.fireStoreRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.fireStoreRef.doc(id).delete();
  }

  getDocumentByID(id: any, collectionName: string) {
    this.fireStoreRef = this.db.collection(collectionName);
    return this.fireStoreRef.doc(id);
  }
}
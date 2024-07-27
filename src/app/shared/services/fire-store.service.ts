import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  createDoc(collection: string, data: any) {
    return this.firestore.collection(collection).add(data);
  }

  getRecords(collection: string): Observable<any[]> {
    return this.firestore
      .collection(collection)
      .valueChanges({ idField: 'id' });
  }

  getFilteredRecords(
    collection: string,
    filters: {
      field: string;
      filter: any;
      operator: any;
    }[]
  ): Observable<any[]> {
    return this.firestore
      .collection(collection, (ref) => {
        let query: any = ref;
        for (const filter of filters) {
          query = query.where(filter.field, filter.operator, filter.filter);
        }
        return query;
      })
      .valueChanges({ idField: 'id' });
  }

  getDocs(collection: string) {
    return this.firestore.collection(collection).snapshotChanges();
  }

  updateDoc(collection: string, docId: string, data: any) {
    return this.firestore.collection(collection).doc(docId).update(data);
  }

  deleteDoc(collection: string, docId: string) {
    return this.firestore.collection(collection).doc(docId).delete();
  }
}

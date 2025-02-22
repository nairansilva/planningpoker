import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
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

  addDocumentWithID(collectionName: string, docID: string, data: any) {
    return this.firestore.collection(collectionName).doc(docID).set(data);
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

  getRecordById(collection: string, id: string): Observable<any> {
    return this.firestore.collection(collection).doc(id).valueChanges();
  }

  getRecordByIdStartWith(
    collection: string,
    prefix: string
  ): Observable<any[]> {
    const end = prefix + '\uf8ff'; // '\uf8ff' é um caractere Unicode que vem após todos os outros caracteres no conjunto Unicode.
    return this.firestore
      .collection(collection, (ref) =>
        ref.orderBy('__name__').startAt(prefix).endAt(end)
      )
      .snapshotChanges()
      .pipe(
        map((actions: any[]) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
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

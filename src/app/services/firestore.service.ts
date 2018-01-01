import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Listing } from '../models/listing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FirestoreService {

  private listingsCollection: AngularFirestoreCollection<Listing>;
  listings: Observable<any[]>;

  constructor(private firestore: AngularFirestore) {
    this.listingsCollection = firestore.collection<Listing>('listings');
  }

  getListings(): Observable<Listing[]> {
    this.listings = this.listingsCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Listing;
        data.id = a.payload.doc.id;
        return data;
      });
    });
    return this.listings;
  }

}

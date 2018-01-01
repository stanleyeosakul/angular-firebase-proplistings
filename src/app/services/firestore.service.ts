import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Listing } from '../models/listing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FirestoreService {

  listingsCollection: AngularFirestoreCollection<Listing>;
  listingDoc: AngularFirestoreDocument<Listing>;
  listings: Observable<Listing[]>;
  listing: Observable<Listing>;

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

  getListingDetails(id: string): Observable<Listing> {
    this.listingDoc = this.firestore.doc<Listing>(`listings/${id}`);
    this.listing = this.listingDoc.valueChanges();
    return this.listing;
  }

}

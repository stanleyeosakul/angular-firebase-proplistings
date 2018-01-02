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

  constructor(private afStore: AngularFirestore) {
    this.listingsCollection = afStore.collection<Listing>('listings');
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
    this.listingDoc = this.afStore.doc<Listing>(`listings/${id}`);
    this.listing = this.listingDoc.valueChanges();
    return this.listing;
  }

  addListing(listing: Listing) {
    this.listingsCollection.add(listing);
  }

  updateListing(id: string, listing: Listing) {
    this.listingDoc = this.afStore.doc(`listings/${id}`);
    this.listingDoc.update(listing);
  }

  deleteListing(id: string) {
    this.listingDoc = this.afStore.doc(`listings/${id}`);
    this.listingDoc.delete();
  }

}

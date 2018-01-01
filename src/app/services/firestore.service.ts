import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Listing } from '../models/listing';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class FirestoreService {

  private listingsCollection: AngularFirestoreCollection<Listing>;
  listings: Observable<any[]>;

  constructor(private firestore: AngularFirestore) { 
    this.listingsCollection = firestore.collection<Listing>('listings');
    this.listings = this.listingsCollection.valueChanges();
  }

  getListings() {
    return this.listings;
  }

}
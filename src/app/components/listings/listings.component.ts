import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Listing } from '../../models/listing';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styles: []
})
export class ListingsComponent implements OnInit {

  listings: Listing[];

  constructor(private firestore: FirestoreService) { 
    this.firestore.getListings().subscribe(listings => {
      this.listings = listings;
      console.log(this.listings);
    });
  }

  ngOnInit() {

  }

}

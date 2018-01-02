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

  constructor(private fireStore: FirestoreService) { }

  ngOnInit() {
    this.fireStore.getListings().subscribe((listings: Listing[]) => {
      this.listings = listings;
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Listing } from '../../models/listing';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styles: []
})
export class ListingComponent implements OnInit {

  id: string;
  listing: Listing;

  constructor(
    private fireStore: FirestoreService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.fireStore.getListingDetails(this.id).subscribe((listing: Listing) => {
      this.listing = listing;
    });
  }

}

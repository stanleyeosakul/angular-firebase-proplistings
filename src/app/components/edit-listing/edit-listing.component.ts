import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Listing } from '../../models/listing';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-listing',
  templateUrl: './edit-listing.component.html',
  styles: []
})
export class EditListingComponent implements OnInit {

  id: string;
  listing: Listing;
  editState = false;

  constructor(
    private fireStore: FirestoreService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.fireStore.getListingDetails(this.id).subscribe(listing => {
      this.listing = listing;
      this.editState = true;
    });
  }

  onEditSubmit(listing: Listing) {
    this.fireStore.updateListing(this.id, listing);
    this.router.navigate(['/listings']);
  }

}

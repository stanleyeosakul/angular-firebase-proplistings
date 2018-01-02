import { Component } from '@angular/core';
import { FirestoreService } from './../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';
import { Upload } from '../../models/upload';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styles: [`
    .red {
      color: red;
    }
  `]
})
export class AddListingComponent {

  listing: any = {};

  selectedFiles: FileList | null;
  currentUpload: Upload;
  submitSwitch = false;
  errorSwitch = false;

  constructor(
    private fireStorage: FirestorageService,
    private fireStore: FirestoreService,
    private router: Router) { }

  detectFiles($event: Event) {
    this.selectedFiles = ($event.target as HTMLInputElement).files;
  }

  uploadSingle() {
    const file = this.selectedFiles;
    if (file && file.length === 1) {
      this.currentUpload = new Upload(file.item(0));
      this.fireStorage.pushUpload(this.currentUpload);
      this.errorSwitch = false;

      // Will grab upload.url correctly if upload time < 2 seconds
      setTimeout(() => {
        this.listing.image_path = this.currentUpload.url;
        this.submitSwitch = true;
      }, 2000);
    } else {
      this.errorSwitch = true;
    }
}

  onAddSubmit() {
    this.fireStore.addListing(this.listing);
    this.router.navigate(['/listings']);
  }

}

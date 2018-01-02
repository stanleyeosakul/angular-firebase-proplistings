import { Injectable } from '@angular/core';
import { Upload } from '../models/upload';
import * as firebase from 'firebase';
import { Listing } from '../models/listing';

@Injectable()
export class FirestorageService {

  basePath = 'listing_images';

  constructor() { }

  // Executes the file uploading to firebase storage at https://firebase.google.com/docs/storage/web/[basePath]
  pushUpload(upload: Upload) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        // upload in progress
        const snap = snapshot;
        upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100;
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        if (uploadTask.snapshot.downloadURL) {
          upload.url = uploadTask.snapshot.downloadURL;
          upload.name = upload.file.name;
          return;
        } else {
          console.error('No download URL!');
        }
      },
    );
  }

  deleteUpload(listing: Listing) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${listing.image_name}`).delete();
  }

}

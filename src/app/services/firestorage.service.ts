import { Injectable } from '@angular/core';
import { Upload } from '../models/upload';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FirestorageService {

  basePath = 'listing_images';

  constructor(private db: AngularFireDatabase) { }

  // Executes the file uploading to firebase https://firebase.google.com/docs/storage/web/[basePath]
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
          this.saveFileData(upload);
          return;
        } else {
          console.error('No download URL!');
        }
      },
    );
  }

  // Writes the file details to the realtime db
  saveFileData(upload: Upload) {
    this.db.list(`${this.basePath}/`).push(upload);
  }

}

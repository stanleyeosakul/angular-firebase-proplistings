# Firebase Property Listings
This project is an update of the code found in the video series [Angular 2 & Firebase App](https://www.youtube.com/watch?v=m5fHtGtyPgk&list=PLillGF-RfqbYftYr5T6bv9idBU7oyADoZ) by *Brad Traversy* using **Angular 5, AngularFire2 (v5), and the Cloud Firestore Database**.  His original code repo may be found [here](https://github.com/bradtraversy/proplistings).  Instructions on how to deploy this code to Firebase are also included.

## Versions Used
* Angular CLI v1.6.3
* Angular v5.1.2
* Angular Fire 2 v5.0.0-rc.4
* Firebase CLI v3.16.0
* Firebase v4.8.0

# Code Updates to Original Project
The original project by [Brad Traversy](https://www.youtube.com/user/TechGuyWeb) was made around March 2017 using Angular 2 and Firebase's Realtime Database.  Since that time, there have been numerous changes to the software ecosystem with the release of Cloud Firestore in early October 2017 as well as Angular 5 in early November 2017.  Hopefully, this repository will help others implement the *Firebase Property Listings* app using these updated technologies.  **The below explanations are introduced by category and are not inclusive of all changes to the original code.**

The important functionality of this project has been extracted into 3 services, and each service will be covered in detail:
1. Firebase Authentication `fireauth.service.ts`
2. Cloud Firestore `firestore.service.ts`
3. Cloud Storage `firestorage.service.ts`

## Authentication - `fireauth.service.ts`
The authentication service uses AngularFire2 to authenticate users using Google Sign-In.  The login and logout functions are shown below.  The `angular2-flash-messages` package was implemented as promises so that they would display to the user after the completion of the login and logout functions.

### Login
```typescript
  // navbar.component.ts and home.component.ts
  login() {
    this.fireAuth.afLogin();
  }
```

```typescript
  // fireauth.service.ts 
  afLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => {
        this.flashMessage.show('You are logged in', { cssClass: 'alert-success', timeout: 3000 });
      });
  }
```

### Logout
```typescript
  // navbar.component.ts
  logout() {
    this.fireAuth.afLogout();
  }
```

```typescript
  // fireauth.service.ts
  afLogout() {
    firebase.auth().signOut()
      .then(() => {
        this.flashMessage.show('You are logged out', { cssClass: 'alert-danger', timeout: 3000 });
      });
  }
```

## Cloud Firestore (Database) - `firestore.service.ts`
Cloud Firestore is a flexible, scalable NoSQL cloud database that is used in this project, replacing the older Realtime Database used in the original video series.  The main purpose of using this database is 1. to display all listings and 2. to implement the ability to create, read, update, and delete an individual listing, also known as CRUD functionality.  The cloud firestore service uses AngularFire2 to perform these tasks.  **The image uploading functionality is handled separately by the cloud storage service**.

### Display all listings
```typescript
  // listings.component.ts
  ngOnInit() {
    this.fireStore.getListings().subscribe((listings: Listing[]) => {
      this.listings = listings;
    });
```

```typescript
  // firestore.service.ts
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
```

### Create a listing
```typescript
  // add-listing.component.ts
  onAddSubmit() {
    this.fireStore.addListing(this.listing);
    this.router.navigate(['/listings']);
  }
```

```typescript
  // firestore.service.ts
  addListing(listing: Listing) {
    this.listingsCollection.add(listing);
  }
```

### Read a listing
```typescript
  // listing.component.ts
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.fireStore.getListingDetails(this.id).subscribe((listing: Listing) => {
      this.listing = listing;
    });
  }
```

```typescript
  // firestore.service.ts 
  getListingDetails(id: string): Observable<Listing> {
    this.listingDoc = this.afStore.doc<Listing>(`listings/${id}`);
    this.listing = this.listingDoc.valueChanges();
    return this.listing;
  }
```

### Update a listing
```typescript
  // edit-listing.component.ts
  onEditSubmit(listing: Listing) {
    this.fireStore.updateListing(this.id, listing);
    this.router.navigate(['/listings']);
  }
```

```typescript
  // firestore.service.ts
  updateListing(id: string, listing: Listing) {
    this.listingDoc = this.afStore.doc(`listings/${id}`);
    this.listingDoc.update(listing);
  }
```
### Delete a listing
```typescript
  // listing.component.ts
  onDeleteClick() {
    this.fireStore.deleteListing(this.id);
    this.fireStorage.deleteUpload(this.listing); // handled by the cloud storage service
  }
```

```typescript
  // firestore.service.ts
  deleteListing(id: string) {
    this.listingDoc = this.afStore.doc(`listings/${id}`);
    this.listingDoc.delete();
  }
```

## Firebase Storage
Cloud Storage for Firebase used to store and serve user-generated files such as documents, images, and videos.  Unfortunately, this feature has not yet been modularized by AngularFire2 so it has to be implemented using the original Firebase code found in their [documentation](https://firebase.google.com/docs/storage/web/start).  The difficulty with using Cloud Storage with Cloud Firestore is that both of these features are separate, and therefore the code is de-coupled.  Because of this, it was challenging to use both services in unison to create a listing with both text properties (stored in Cloud Firestore) and an associated image (stored in Cloud Storage).  The solution I came up with using `setTimeout()` is far from perfect, but hopefully can be improved upon in the future.  In this project, an image can be uploaded, viewed, and deleted for each listing.

### Upload the image
```html
  <!-- add-listing.component.html -->
  <label>Image<sup class="red">*</sup></label><br>  
  <input type="file" (change)="detectFiles($event)">
  <a class="btn btn-primary" routerLink="/add-listing" (click)="onUploadImage()">Upload</a>
```

```typescript
  // add-listing.component.ts
  detectFiles($event: Event) {
    this.selectedFiles = ($event.target as HTMLInputElement).files;
  }

  onUploadImage() {
    const file = this.selectedFiles;
    if (file && file.length === 1) {
      this.currentUpload = new Upload(file.item(0));
      this.fireStorage.pushUpload(this.currentUpload); // File uploaded to cloud storage here
      this.errorSwitch = false;

      // upload.name and upload.url is defined asynchronously only after upload is completed
      // listing object will define upload.name and upload.url correctly if upload time < 2000 milliseconds (2 seconds)
      setTimeout(() => {
        this.listing.image_name = this.currentUpload.name;
        this.listing.image_path = this.currentUpload.url;
        this.submitSwitch = true;
      }, 2000);
    } else {
      this.errorSwitch = true;
    }
}
```

```typescript
  // firestorage.service.ts

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
```
### View the image
```html
  <!-- listing.component.html -->
  <div class="col-md-4">
    <img style="width: 100%" class="img-thumbnail" src="{{ listing?.image_path }}">
  </div>
```

### Delete the image
```typescript
  // listing.component.ts
  onDeleteClick() {
    this.fireStore.deleteListing(this.id); // handled by the cloud firestore service
    this.fireStorage.deleteUpload(this.listing);
  }
```

```typescript
  // firestorage.service.ts
  deleteUpload(listing: Listing) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${listing.image_name}`).delete();
  }
```

# Cloning the Project for Personal Use
## Installing the Project
To begin working with this project, perform the following tasks:

1. Clone this repo: `git clone https://github.com/Stanza987/angular-firebase-proplistings.git`
1. `cd` into the folder of the cloned repo
1. Run `yarn install` to install dependencies
1. Add your Firebase configuration to `environment.ts` and `environment.prod.ts`

    ```typescript
    export const environment = {
        production: false, //change to true for environment.prod.ts
        firebase: {
            apiKey: '<your-key>',
            authDomain: '<your-project-authdomain>',
            databaseURL: '<your-database-URL>',
            projectId: '<your-project-id>',
            storageBucket: '<your-storage-bucket>',
            messagingSenderId: '<your-messaging-sender-id>'
        }
    };
    ```

## Deploying to Firebase
1. Run `ng build --prod`
1. Run `firebase init` and choose `Hosting`, follow the on-screen prompts.
1. Delete the `public` directory automatically generated by the Firebase CLI
1. Change `firebase.json` to
    ```
    {
        "hosting": {
            "public": "dist",
            "ignore": [
                "firebase.json",
                "**/.*",
                "**/node_modules/**"
            ],
            "rewrites": [
                {
                    "source": "**",
                    "destination": "/index.html"
                }
            ]
        }
    }
    ```
1. Run `firebase deploy`

## Further help
* [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md)
* [Angular Fire 2 README](https://github.com/angular/angularfire2/blob/master/README.md)
* [Firebase Cloud Storage Docs](https://firebase.google.com/docs/storage/web/start)
* [Firebase Docs](https://firebase.google.com/docs/web/setup)
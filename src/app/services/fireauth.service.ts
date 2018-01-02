import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FireauthService {

  afAuthState: Observable<firebase.User> = this.afAuth.authState;

  constructor(private afAuth: AngularFireAuth) { }

  afLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((res) => {
        console.log(res.user);
      }).catch((err) => {
        console.log(err);
      });
  }

  afLogout() {
    firebase.auth().signOut()
    .then(() => {
      console.log('Sign Out Successful');
    }).catch(function (err) {
      console.log(err);
    });
  }

}

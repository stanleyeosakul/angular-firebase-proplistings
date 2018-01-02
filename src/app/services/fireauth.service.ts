import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { FlashMessagesService } from 'angular2-flash-messages';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FireauthService {

  afAuthState: Observable<firebase.User> = this.afAuth.authState;

  constructor(private afAuth: AngularFireAuth, public flashMessage: FlashMessagesService) { }

  afLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => {
        this.flashMessage.show('You are logged in', { cssClass: 'alert-success', timeout: 3000 });
      });
  }

  afLogout() {
    firebase.auth().signOut()
      .then(() => {
        this.flashMessage.show('You are logged out', { cssClass: 'alert-danger', timeout: 3000 });
      });
  }

}

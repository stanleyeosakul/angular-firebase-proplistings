import { Component } from '@angular/core';
import { FireauthService } from '../../services/fireauth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent {

  constructor(public fireAuth: FireauthService, public flashMessage: FlashMessagesService) { }

  login() {
    this.fireAuth.afLogin();
  }

}

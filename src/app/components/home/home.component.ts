import { Component, OnInit } from '@angular/core';
import { FireauthService } from '../../services/fireauth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  constructor(public fireAuth: FireauthService, public flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  login() {
    this.fireAuth.afLogin();
  }

}

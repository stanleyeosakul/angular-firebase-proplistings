import { Component, OnInit } from '@angular/core';
import { FireauthService } from '../../services/fireauth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [`
    .btn {
      color: rgba(255, 255, 255, 0.5);
    }

    .btn:hover {
      color: white;
    }

    .active {
      background: #2071cc;
      color: white;
    }
  `]
})
export class NavbarComponent implements OnInit {

  constructor(public fireAuth: FireauthService, public flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  login() {
    this.fireAuth.afLogin();
  }

  logout() {
    this.fireAuth.afLogout();
    this.flashMessage.show('You are logged out', { cssClass: 'alert-danger', timeout: 3000 });
  }

}

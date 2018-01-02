import { Component } from '@angular/core';
import { FireauthService } from '../../services/fireauth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent {

  constructor(public fireAuth: FireauthService) { }

  login() {
    this.fireAuth.afLogin();
  }

}

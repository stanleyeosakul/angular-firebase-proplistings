import { Component, OnInit } from '@angular/core';
import { FireauthService } from '../../services/fireauth.service';

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

  constructor(public fireAuth: FireauthService) { }

  ngOnInit() {
  }

  login() {
    this.fireAuth.afLogin();
  }

  logout() {
    this.fireAuth.afLogout();
  }

}

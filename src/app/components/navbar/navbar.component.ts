import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}

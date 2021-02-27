import { Component, OnInit } from '@angular/core';
import {AppService} from '../../../../core/services/app.service';
import {Route, Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isCollapsed: any;
  notificationCount = 0;
  allNotification: any;
  str = 'Message {{i}} Title here ok then here is overiding the text.';

  constructor(private appService: AppService, private router: Router) {
  }

  ngOnInit(): void {
    this.allNotification = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  }

  toggleSidebarPin(): any {
    this.appService.toggleSidebarPin();
  }

  toggleSidebar(): any {
    this.appService.toggleSidebar();
  }

  logout(): any {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/sign-in']);
  }
}

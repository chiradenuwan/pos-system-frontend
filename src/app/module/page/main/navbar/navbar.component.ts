import { Component, OnInit } from '@angular/core';
import {AppService} from '../../../../core/services/app.service';

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

  constructor(private appService: AppService) {
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

}

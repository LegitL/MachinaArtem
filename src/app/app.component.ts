import { Component, OnInit } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private platform: Platform,
    private navController: NavController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService
  ) {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      this.isAuthenticated = user !== null;
    });
  }

  public navigateToProfile(): void {
    this.navController.navigateRoot('/profile');
  }
}

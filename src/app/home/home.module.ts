import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { StyleSettingsPopoverComponent } from './style-settings-popover/style-settings-popover.component';
import { FavoritesPageModule } from '../favorites/favorites.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritesPageModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  entryComponents: [StyleSettingsPopoverComponent],
  declarations: [HomePage, StyleSettingsPopoverComponent]
})
export class HomePageModule {}

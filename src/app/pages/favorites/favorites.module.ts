import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FavoritesPage } from './favorites.page';
import { CommunityPage } from '../community/community.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [FavoritesPage],
  entryComponents: [FavoritesPage],
  providers: [CommunityPage]
})
export class FavoritesPageModule {}

import { Component, OnInit  } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, ToastController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { FavoriteStylesService, FavoriteStyle } from '../services/favorite-styles.service';
import { WikiArtService } from '../services/wiki-art.service';
import { depthToSpace } from '@tensorflow/tfjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  reorderMode = false;
  favorites: any[];

  /**
   * ...
   *
   * @param modalController ...
   */
  constructor(
    private sanitizer: DomSanitizer,
    private modalController: ModalController,
    private toastController: ToastController,
    private favoriteStylesService: FavoriteStylesService,
    private wikiArtService: WikiArtService
  ) {}

  /**
   * ...
   */
  public async ngOnInit(): Promise<void> {
    this.loadData();
  }

  /**
   * ...
   *
   * @param index ...
   */
  public toggleReorderMode(): void {
    this.reorderMode = !this.reorderMode;
  }

  /**
   * ...
   *
   * @param event ...
   */
  public doReorder(event: any): void {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    this.favoriteStylesService.moveItem(event.detail.from, event.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    event.detail.complete();
  }

  /**
   * ...
   */
  public async add(): Promise<void> {
    // const image = await Plugins.Camera.getPhoto({
    //   resultType: CameraResultType.Uri,
    //   source: CameraSource.Prompt
    // });

    // const imageData = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
    // const favorite: FavoriteStyle = {
    //   isWikiart: false,
    //   isPublic: false,
    //   title: '',
    //   description: '',
    //   image: '' + imageData,
    //   date: (new Date()).toDateString(),
    //   author: {
    //     name: 'You'
    //   }
    // };
    // await this.favoriteStylesService.addFavorite(favorite);
    // this.loadData();
  }

  /**
   * ...
   *
   * @param item ...
   */
  public async togglePublic(index: number) {
    this.favorites[index].isPublic = !this.favorites[index].isPublic;
    this.favoriteStylesService.updateFavorite(this.favorites[index], index);
    const toast = await this.toastController.create({
      message: (this.favorites[index].isPublic) ? 'Item made public' : 'Item made private',
      color: 'light',
      duration: 2000
    });
    toast.present();
  }

  /**
   * ...
   *
   * @param event ...
   * @param index ...
   */
  public onTitleBlur(event: any, index: number): void {
    const newTitle = event.target.value;
    if (this.favorites[index].title !== newTitle) {
      this.favorites[index].title = newTitle;
      this.favoriteStylesService.updateFavorite(this.favorites[index], index);
    }
  }

  /**
   * ...
   *
   * @param event ...
   * @param index ...
   */
  public onDescriptionBlur(event: any, index: number): void {
    const newDescription = event.target.value;
    if (this.favorites[index].description !== newDescription) {
      this.favorites[index].description = newDescription;
      this.favoriteStylesService.updateFavorite(this.favorites[index], index);
    }
  }

  /**
   * ...
   *
   * @param index ...
   */
  public async delete(index: number): Promise<void> {
    await this.favoriteStylesService.removeFavorite(index);
    this.loadData();
  }

  /**
   * ...
   */
  public dismissModal(): void {
    this.modalController.dismiss();
  }

  /**
   * ...
   *
   * @param url ...
   */
  public smallImageUrl(url: string): string {
    return this.wikiArtService.smallImageUrl(url);
  }

  /*
   * ...
   */
  private async loadData(): Promise<void> {
    this.favorites = await this.favoriteStylesService.getAllFavorites();
  }
}

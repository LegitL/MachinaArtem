import { Component, OnInit  } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { FavoriteStylesService } from '../../services/favorite-styles.service';
import { Style } from 'src/app/models/style';
import { WikiArtService } from '../../services/wiki-art.service';
import * as uuidv4 from 'uuid/v4';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  loader
  reorderMode = false;
  favorites: any[];

  /**
   * ...
   *
   * @param modalController ...
   */
  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
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
    const image = await Plugins.Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    console.log(image);
    const favorite: Style = {
      slug: uuidv4(),
      isWikiart: false,
      isPublic: false,
      title: '',
      description: '',
      image: image.dataUrl,
      date: (new Date()).toDateString(),
      author: {
        name: 'You'
      }
    };
    this.showLoader();
    try {
      await this.favoriteStylesService.addFavorite(favorite);
      this.loadData();
    } finally {
      this.hideLoader();
    }
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
    this.showLoader();
    try {
      await this.favoriteStylesService.removeFavorite(index);
      this.loadData();
    } finally {
      this.hideLoader();
    }
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
    return url.includes('data:') ? url : this.wikiArtService.smallImageUrl(url);
  }

  /*
   * ...
   */
  private async loadData(): Promise<void> {
    this.favorites = await this.favoriteStylesService.getAllFavorites();
  }

    /*
   * ... 
   */
  private async showLoader() {
    this.loader = await this.loadingController.create({
      message: 'Please wait...'
    });
    return await this.loader.present();
  }

  /*
   * ...
   */
  private hideLoader() {
    this.loader.dismiss();
  }
}

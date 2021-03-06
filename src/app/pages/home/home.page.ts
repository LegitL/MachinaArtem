import { Component, OnInit } from '@angular/core';
import { LoadingController, PopoverController, Platform, ToastController, ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import * as mi from '@magenta/image';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { StyleSettingsPopoverComponent } from './style-settings-popover/style-settings-popover.component';
import { FavoriteStylesService } from '../../services/favorite-styles.service';
import { Style } from 'src/app/models/style';
import { WikiArtService } from '../../services/wiki-art.service';
import { FavoritesPage } from '../favorites/favorites.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  loader: HTMLIonLoadingElement;
  model: any;
  styles: Style[];
  selectedStyleIndex: number;
  resultHeight = 0;
  resultWidth = 0;
  styleAmount = 75;
  styleSize = 75;
  photo: SafeResourceUrl = 'https://picsum.photos/750/1050';

  sliderImageOptions = {
    zoom: {
      maxRatio: 3
    }
  };

  slidesThumbnailsOptions = {
    slidesPerView: 'auto',
    zoom: false,
  };

  /**
   * ...
   * 
   * @param platform ...
   * @param sanitizer ...
   * @param loadingController ...
   * @param popoverController ...
   * @param modalController ...
   * @param toastController ...
   * @param base64ToGallery ...
   * @param favoriteStylesService ... 
   * @param wikiArtService ...
   */
  public constructor(
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private toastController: ToastController,
    private base64ToGallery: Base64ToGallery,
    private favoriteStylesService: FavoriteStylesService,
    private wikiArtService: WikiArtService,
  ) {  }

  /**
   * ...
   */
  public async ngOnInit(): Promise<void> {
    this.model = new mi.ArbitraryStyleTransferNetwork();
    this.model.initialize();

    // Load favorite styles
    await this.loadData();
  }

  /**
   * ...
   */
  public async takePicture(): Promise<void> {
    const image = await Plugins.Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
  }

  /**
   * ...
   */
  public async savePicture(): Promise<void> {
    if (this.platform.is('cordova')) {
      try {
        const resultCanvas = document.getElementById('result') as HTMLCanvasElement;
        const res = await this.base64ToGallery.base64ToGallery(resultCanvas.toDataURL());
        const toast = await this.toastController.create({
          message: 'Your stylized image has been saved.',
          duration: 2000
        });
        toast.present();
      } catch (ex) {
        console.error('Error', ex);
      }
    } else {
      console.error('Not running on mobile device');
    }
  }

  /**
   * ...
   * 
   * @param event ...
   */
  public onThumbnailTap(event: any) {
    const tappedIndex = event.target.swiper.clickedIndex;
    if (tappedIndex !== undefined) {
      if (tappedIndex === 0) {
        // 'more' has been tapped/clicked
        this.showMoreModal();
      } else {
        // Thumbnail with styles has been tapped/clicked
        this.selectedStyleIndex = tappedIndex - 1;  // account for first one beeing "more"

        const originalImg = document.getElementById('original') as HTMLImageElement;
        const styleImg = document.getElementById('style') as HTMLImageElement;
        const styleRatio = this.styleSize / 100;
        styleImg.style.setProperty('height',  (originalImg.height * styleRatio) + 'px');
      }
    }
  }

  /**
   * ...
   */
  public async stylize(): Promise<void> {
    await this.showLoader();

    const originalImg = document.getElementById('original') as HTMLImageElement;
    const resultCanvas = document.getElementById('result') as HTMLCanvasElement;
    const styleImg = document.getElementById('style') as HTMLImageElement;
    const strength = this.styleAmount / 100;

    this.resultHeight = originalImg.height;
    this.resultWidth = originalImg.width;

    resultCanvas.style.setProperty('top', originalImg.offsetTop + 'px');
    resultCanvas.style.setProperty('left', originalImg.offsetLeft + 'px');

    // Use timout:0 to give a chance for canvas size to be set by javascript event queue.
    setTimeout(() => {
      this.model.stylize(originalImg, styleImg, strength).then((imageData: ImageData) => {
        resultCanvas.getContext('2d').putImageData(imageData, 0, 0);
        this.hideLoader();
      });
    }, 0);
  }

  /**
   * ...
   */
  public prepareCanvas(): void {
    const resultCanvas = document.getElementById('result') as HTMLCanvasElement;
    const context = resultCanvas.getContext('2d');
    context.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    delete this.selectedStyleIndex;
  }

  /**
   * ...
   */
  public shuffleImage(): void {
    this.photo = `https://picsum.photos/750/1050?${Math.random()}`;
  }

  /**
   * ...
   * 
   * @param ev ...
   */
  public async showStyleSettingsPopover(ev: any): Promise<void> {
    const popover = await this.popoverController.create({
      component: StyleSettingsPopoverComponent,
      componentProps: {
        styleAmount: this.styleAmount,
        styleSize: this.styleSize
      },
      event: ev
    });
    await popover.present();

    const detail = await popover.onWillDismiss();
    if (detail.data) {
      this.styleAmount = detail.data.styleAmount;
      this.styleSize = detail.data.styleSize;
      this.prepareCanvas();
    }
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
    this.styles = await this.favoriteStylesService.getAllFavorites();
  }

  /*
   * ...
   */
  private async showMoreModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: FavoritesPage
    });
    await modal.present();
    await modal.onWillDismiss();
    this.loadData();
  }

  /*
   * ... 
   */
  private async showLoader() {
    this.loader = await this.loadingController.create({
      message: 'Stylizing...'
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

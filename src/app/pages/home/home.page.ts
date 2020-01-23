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
 
/**
* The main section of the application and the home screen. This page includes the image stylization network
* along with style settings popover and favourite style modal. This page is the first page the user sees
* when opening the application.
*/
export class HomePage implements OnInit {
 
 loader: HTMLIonLoadingElement;
 model: any;
 styles: Style[]; // this array contains all favourite styles
 selectedStyleIndex: number;
 resultHeight = 0;
 resultWidth = 0;
 styleAmount = 75; // defined by style setting popover, default is 75%
 styleSize = 75; // defined by style setting popover, default is 75%
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
  * Constructor sets up all basic plugins and dependencies
  *
  * @param platform  The user's platform, automatically set to Cordova
  * @param sanitizer Sanitizes a value for use in the given SecurityContext
  * @param loadingController Loader that displays when AI stylizes photos
  * @param popoverController Popover that displays style settings, opens on 'setting' icon
  * @param modalController Modal that displays favourite styles, where the user edit's, adds or delete favourite styles
  * @param toastController Toast that displays after an image is successfully saved onto the user's photo gallery
  * @param base64ToGallery Converts a base64 string to an image file in the user's photo gallery
  * @param favoriteStylesService Service that is used to edit, save and delete favourite styles
  * @param wikiArtService Service that access WikiArt rest API's resources
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
  * The method is called when the Home page is initialized and sets up the
  * arbitrary transfer network model from Magenta image
  */
 public async ngOnInit(): Promise<void> {
   this.model = new mi.ArbitraryStyleTransferNetwork();
   this.model.initialize();
 
   // Load favorite styles
   await this.loadData();
 }
 
 /**
  * The method accesses the camera and photo gallery using Capacitor.
  * The user chooses between taking a picture or picking a picture from their device's photo gallery.
  */
 public async takePicture(): Promise<void> {
   const image = await Plugins.Camera.getPhoto({
     resultType: CameraResultType.Uri,
     source: CameraSource.Prompt
   });
 
   this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
 }
 
 /**
  * The method saves the resultCanvas (the result of the AI's stylization) to the device photo gallery.
  * The HTML canvas element is converted to a Base64 URL.
  * The Base64ToGallery plugin is used to to convert the Base 4 URl to  an image file in the user's photo gallery.
  * A toast notifies the user if the image is saved successfully
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
  * The method gathers the index of a favourites style slide that was tapped on by the user.
  * If the tapped index was the first slide then it opens the showMoreModal otherwise it sets the
  * class variable, selectedStyleIndex, to the tapped index using the event target.
  * Additionally, it gathers the original image, favoutie style image and the style ratio from
  * the images displayed on the screen.
  *
  * @param event When the user taps on one of the favourite style slides.
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
  * the method preforms arbitrary image stylization using Magenta Image library.
  * This is based of of the work of Reiichiro Nakano's work on porting arbitrary
  * image stylization to the browser.
  *
  * The method starts by gathering the image data displayed and setting up the resultCanvas.
  * The image is then stylized.
  *
  * @see https://github.com/tensorflow/magenta-js/tree/master/image
  * @see https://magenta.tensorflow.org/blog/2018/12/20/style-transfer-js/
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
  * This method clears the canvas inorder to allow new images to be stylized or
  * the original image to be stylized by different favourite styles.
  */
 public prepareCanvas(): void {
   const resultCanvas = document.getElementById('result') as HTMLCanvasElement;
   const context = resultCanvas.getContext('2d');
   context.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
   delete this.selectedStyleIndex;
 }
 
 /**
  * This method gathers a random image from Lorem Picsum
  */
 public shuffleImage(): void {
   this.photo = `https://picsum.photos/750/1050?${Math.random()}`;
 }
 
 /**
  * This method displays the style setting popover.
  * Components include style amount and style size which are class variables used
  * in the arbitrary image stylization model.
  *
  * When style settings are saved, then the canvas is reset so that any previous stylizing is cleared.
  * This prevents errors that would arise from continually stylizing the stylized image.
  *
  * @param ev Event when the user taps on the style settings icon
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
  * The method converts a WikiArt image url to a smaller image url.
  * This is done since the home page's favourite style images does not require high definition.
  * Therfore, this speeds up the image stylization proccess.
  *
  * @param url A WikiArt url representing an image of an artowrk
  */
 public smallImageUrl(url: string): string {
   return url.includes('data:') ? url : this.wikiArtService.smallImageUrl(url);
 }
 
 /*
  * The method loads all favourite styles to the home page
  */
 private async loadData(): Promise<void> {
   this.styles = await this.favoriteStylesService.getAllFavorites();
 }
 
 /*
  * The method presents the show more modal.
  * This modal deals with editing, adding or deleting favorite styles.
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
  * The method shows a loader when stylizing an image.
  */
 private async showLoader() {
   this.loader = await this.loadingController.create({
     message: 'Stylizing...'
   });
   return await this.loader.present();
 }
 
 /*
  * The method hides the loader when the image has been stylized.
  */
 private hideLoader() {
   this.loader.dismiss();
 }
}
 


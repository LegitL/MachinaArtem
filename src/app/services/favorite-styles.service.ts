import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';
import { first } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { ProfileService } from './profile.service';
import { Style } from '../models/style';
import { CommunityStylesService } from './community-styles.service';

const { Storage } = Plugins;

const favouriteKey = 'favorites';
const initializedKey = 'favoritesInitialized';

/**
 * This class is responsible for all action related to the user's saved styles, including adding the new style
 * to the user's collection, remove a style from the user's collection, update information on each saved styke,
 * and change the order of the display of the saved styles 
 */

@Injectable({
  providedIn: 'root'
})


export class FavoriteStylesService {

  /**
   * Consturctor sets up all basic plugin dependencies in the class
   * @param httpClient 
   * @param storage The Cloud Firestore storage that stored all favorited styles of the user
   * @param profileService The service that performs all actions related to the profile stored in Cloud Firestore
   * @param communityStylesService The service that performs all actions related to the community style (Publically shared by the user)
   */

  constructor(
    private httpClient: HttpClient,
    private storage: AngularFireStorage,
    private profileService: ProfileService,
    private communityStylesService: CommunityStylesService
  ) {
  }

  /**
   * The method is called to reinitialize the styles the user stored once the page is reloaded,
   * because the storage of the user's favorite style can be updated when the user input a new one.
   * The method will first call the favorite-style.json to get all user's favorite styles
   */
  private async initialize(): Promise<void> {
    const favorites = await this.httpClient.get<Style[]>('assets/data/default-favorites.json').toPromise();
    this.addAllFavorites(favorites);
    this.setInitialize(true);
  }

  /**
   * The method is called to get all favorite styles from favorite-style.json
   * All these styles will display on both the home page and the favorited page
   */
  public async getAllFavorites(): Promise<Style[]> {
    // Check if we are initialized and if not do lazy initialization here.
    // This will happen after app fresh install and after logout.
    if (!await this.didInitialize()) {
      await this.initialize();
    }

    // If signed-in, first retrive from firebase and store to local storage
    const userProfile$ = await this.profileService.getUserProfile();
    if (userProfile$) {
      const userProfile = await userProfile$.pipe(first()).toPromise();
      if (userProfile.favoriteStyles) {
        await Storage.set({ key: favouriteKey, value: userProfile.favoriteStyles });
      }
    }
  
    const data = await Storage.get({ key: favouriteKey });
    return JSON.parse(data.value);
  }

  /**
   * The method is called to add all favorites the user added to favorite-style.json
   * @param favorites The json list that stored all the user's favorite styles, the list will be compared to the added styles.
   * The method will be finished if all the new favorited styles are added to the user's favorite styles
   */
  public async addAllFavorites(favorites: Style[]): Promise<void> {
    // If signed-in, store favorites to the firebase
    // and copy all marked as public to Style (community) collection
    const userProfile$ = await this.profileService.getUserProfile();
    if (userProfile$) {
      // First upload all new images
      favorites = await Promise.all(favorites.map(async favorite => {
        if (favorite.image.includes('data:')) {
          favorite.image = await this.uploadImage(favorite.slug, favorite.image);
        }
        return favorite;
      }));
      const userProfile = await userProfile$.pipe(first()).toPromise();
      // Delete private from Styles and copy public to Styles collection
      await Promise.all(favorites.map(async style => {
        if (style.id) {
          // All public styles have an id,
          // so remove all previously public styles
          await this.communityStylesService.removeStyle(style);
          delete style.id;
        }
        if (style.isPublic && !style.isWikiart) {
          // Update author information, add all styles
          // that are marked public, and remember their public ids
          const publicStyle = {...style};
          publicStyle.author = {
            id: userProfile.id,
            name: userProfile.name || '',
            bio: userProfile.bio || '',
            avatar: userProfile.avatar || '',
          }
          const styleDocRef = await this.communityStylesService.addStyle(publicStyle);
          style.id = styleDocRef.id;
        }
      }));
      const favoritesValue = JSON.stringify(favorites);
      userProfile.favoriteStyles = favoritesValue;
      await this.profileService.updateUser(userProfile);
    }

    const favoritesValue = JSON.stringify(favorites);
    await Storage.set({ key: favouriteKey, value: favoritesValue });
  }

  /**
   * The method is called to remove the old list of styles
   */
  public async removeAllFavorites(): Promise<void> {
    await Storage.remove({ key: favouriteKey });
    await Storage.remove({ key: initializedKey });
    this.initialize();
  }

  /**
   * The method is called to add new styles to the json array of saved (Favorite) styles
   * The method will call addAllFavorite() to add the styles to the array of styles stored in favorite-style.json
   * @param style The style Object that need to be added to the style.
   */
  public async addFavorite(style: Style): Promise<void> {
    style.slug = style.isWikiart ? this.getSlug(style.image) : style.slug;
    const favorites = await this.getAllFavorites();
    favorites.splice(0, 0, style);
    await this.addAllFavorites(favorites);
  }

  /**
   * The method is called to extend the list of the styles stored in favorite-style.json file
   * @param style The selected style that will be added to the style array
   * @param index The location of the style inside the array. 
   */
  public async updateFavorite(style: Style, index: number): Promise<void> {
    const favorites = await this.getAllFavorites();
    favorites[index] = style;
    await this.addAllFavorites(favorites);
  }

  /**
   * The method is called to move a selected item from the intial location to the targeted location
   * @param from The initial location (index) of the style Obejct in the array
   * @param to The final location (index) of the style Object in the array
   */
  public async moveItem(from: number, to: number): Promise<void> {
    const favorites = await this.getAllFavorites();
    favorites.splice(to, 0, favorites.splice(from, 1)[0]);
    await this.addAllFavorites(favorites);
  }

  /**
   * The method is called to remove a selected style from the array of styles in favorite-style.json
   * @param index The location (index) of the style Obejct in the array
   */
  public async removeFavorite(index: number): Promise<void> {
    let favorites = await this.getAllFavorites();
    favorites.splice(index, 1);
    await this.addAllFavorites(favorites);
  }

  /**
   * A boolean that indicates whether the favorited style is defined
   * @param url The url of the image
   */
  public async hasFavorite(url: string): Promise<boolean> {
    const favorites = await this.getAllFavorites();
    const found = favorites.find(favorite => favorite.slug === this.getSlug(url));
    return found !== undefined;
  }

  /**
   * The method is called for quick initialization
   * @returns JSON.parse(data.value); The flag that indicates whether the favorite-style.json is reinitialized.
   */
  private async didInitialize(): Promise<boolean> {
    const data = await Storage.get({ key: initializedKey });
    return JSON.parse(data.value);
  }

  /**
   * The method is called to initialize the styles
   * @param flag The flag that indicates whether it is ready to initialize.
   */
  public async setInitialize(flag: boolean): Promise<void> {
    await Storage.set({ key: initializedKey, value: JSON.stringify(flag) });
  }

  /**
   * The method is called to get the slug, which is a special ID to identify the source of each WikiArt styles:
   * Since no descriptions were given for these art styles in the WikiArt API, 
   * a Wikipedia slug from the Wikipedia API reference was added inorder 
   * to gather the descriptions for each style.
   * @param url The source of the WikiArt Style
   * @return slug; the slug of the WikiArt Style
   */
  private getSlug(url: string): string {
    let slug: string = url;
    slug = slug.substr(slug.lastIndexOf('/'));
    slug = slug.substring(0, slug.indexOf('.'));
    return slug;
  }

  /**
   * The method is called when the user upload the image. The method will accept 
   * the user's input and add the input to favorite-style.json
   * @param id The id of the uploaded style, which is given once the image is uploaded
   * @param dataUrl The URL of the input image
   */
  private uploadImage(id: string, dataUrl: string): Promise<string> {
    const storageRef = this.storage.ref(`style-images/${id}`);
    return storageRef.putString(dataUrl, 'data_url')
      .then(() => storageRef.getDownloadURL().toPromise<string>());
  }
}

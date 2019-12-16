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

@Injectable({
  providedIn: 'root'
})
export class FavoriteStylesService {

  constructor(
    private httpClient: HttpClient,
    private storage: AngularFireStorage,
    private profileService: ProfileService,
    private communityStylesService: CommunityStylesService
  ) {
    this.didInitialize().then(initialized => {
      if (!initialized) {
        this.initialize();
      }
    });
  }

  private initialize(): void {
    this.httpClient.get<Style[]>('assets/data/default-favorites.json').subscribe(favorites => {
      this.addAllFavorites(favorites);
      this.setInitialize(true);
    });
  }

  public async getAllFavorites(): Promise<Style[]> {
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
            name: userProfile.name,
            bio: userProfile.bio,
            avatar: userProfile.avatar,
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

  public async removeAllFavorites(): Promise<void> {
    await Storage.remove({ key: favouriteKey });
    await Storage.remove({ key: initializedKey });
    this.initialize();
  }

  public async addFavorite(style: Style): Promise<void> {
    style.slug = style.isWikiart ? this.getSlug(style.image) : style.slug;
    const favorites = await this.getAllFavorites();
    favorites.splice(0, 0, style);
    await this.addAllFavorites(favorites);
  }

  public async updateFavorite(style: Style, index: number): Promise<void> {
    const favorites = await this.getAllFavorites();
    favorites[index] = style;
    await this.addAllFavorites(favorites);
  }

  public async moveItem(from: number, to: number): Promise<void> {
    const favorites = await this.getAllFavorites();
    favorites.splice(to, 0, favorites.splice(from, 1)[0]);
    await this.addAllFavorites(favorites);
  }

  public async removeFavorite(index: number): Promise<void> {
    let favorites = await this.getAllFavorites();
    favorites.splice(index, 1);
    await this.addAllFavorites(favorites);
  }

  public async hasFavorite(url: string): Promise<boolean> {
    const favorites = await this.getAllFavorites();
    const found = favorites.find(favorite => favorite.slug === this.getSlug(url));
    return found !== undefined;
  }

  private async didInitialize(): Promise<boolean> {
    const data = await Storage.get({ key: initializedKey });
    return JSON.parse(data.value);
  }

  public async setInitialize(flag: boolean): Promise<void> {
    await Storage.set({ key: initializedKey, value: JSON.stringify(flag) });
  }

  private getSlug(url: string): string {
    let slug: string = url;
    slug = slug.substr(slug.lastIndexOf('/'));
    slug = slug.substring(0, slug.indexOf('.'));
    return slug;
  }

  private uploadImage(id: string, dataUrl: string): Promise<string> {
    const storageRef = this.storage.ref(`style-images/${id}`);
    return storageRef.putString(dataUrl, 'data_url')
      .then(() => storageRef.getDownloadURL().toPromise<string>());
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

const favouriteKey = 'favorites';
const initializedKey = 'favoritesInitialized';

@Injectable({
  providedIn: 'root'
})
export class FavoriteStylesService {

  constructor(
    private httpClient: HttpClient,
  ) {
    console.log('FavoriteStylesService.constructor()');
    this.didInitialize().then(initialized => {
      if (!initialized) {
        this.httpClient.get<FavoriteStyle[]>('assets/data/default-favorites.json').subscribe(favorites => {
          this.addAllFavorites(favorites);
          this.setInitialize(true);
        });
      }
    });
  }

  public async getAllFavorites(): Promise<FavoriteStyle[]> {
    const data = await Storage.get({ key: favouriteKey });
    return JSON.parse(data.value);
  }

  public async addAllFavorites(favorites: FavoriteStyle[]): Promise<void> {
    await Storage.set({ key: favouriteKey, value: JSON.stringify(favorites) });
  }

  public async addFavorite(style: FavoriteStyle): Promise<void> {
    style.slug = this.getSlug(style.image);
    const favorites = await this.getAllFavorites();
    favorites.splice(0, 0, style);
    await this.addAllFavorites(favorites);
  }

  public async updateFavorite(style: FavoriteStyle, index: number): Promise<void> {
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
}

export interface FavoriteStyle {
  slug?: string;
  title?: string;
  image: string;
  description?: string;
  isPublic: boolean;
  isWikiart: boolean;
  date: string;
  author?: {
    name: string;
    bio?: string;
  };
}

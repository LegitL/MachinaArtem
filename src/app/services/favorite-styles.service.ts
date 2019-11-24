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
    const favorites = await this.getAllFavorites();
    favorites.push(style);
    await this.addAllFavorites(favorites);
  }

  public async removeFavorite(id: string): Promise<void> {
    let favorites = await this.getAllFavorites();
    favorites = favorites.filter(favorite => favorite.id !== id);
    await this.addAllFavorites(favorites);
  }

  public async hasFavorite(id: string): Promise<boolean> {
    const favorites = await this.getAllFavorites();
    const found = favorites.find(favorite => favorite.id === id);
    return found !== undefined;
  }

  private async didInitialize(): Promise<boolean> {
    const data = await Storage.get({ key: initializedKey });
    return JSON.parse(data.value);
  }

  public async setInitialize(flag: boolean): Promise<void> {
    await Storage.set({ key: initializedKey, value: JSON.stringify(flag) });
  }
}

export interface FavoriteStyle {
  id: string;
  title?: string;
  image: string;
  description?: string;
  date: string;
  author?: {
    name: string;
    bio?: string;
  };
}

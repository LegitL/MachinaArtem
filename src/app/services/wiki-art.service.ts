import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const baseUrl = 'http://www.wikiart.org/en';
const dictionariesUrl = `${baseUrl}/App/wiki/DictionariesJson/`;
const mostViewedPaintingsUrl = `${baseUrl}/App/Painting/MostViewedPaintings?json=2&inPublicDomain=true`;
const artistsUrl = `${baseUrl}/App/Artist/AlphabetJson?v=new`;
const paintingsByStyleUrl = `${baseUrl}/paintings-by-style`;
const paintingsByArtistUrl = `${baseUrl}/App/Painting/PaintingsByArtist`;
const paintingUrl = `${baseUrl}/App/Painting/ImageJson/`;

@Injectable({
  providedIn: 'root'
})
export class WikiArtService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  public  mostedViewedPaintings(): Observable<any[]> {
    return this.httpClient.get<any[]>(mostViewedPaintingsUrl);
  }

  public dictionaries(group: Groups): Observable<any[]> {
    return this.httpClient.get<any[]>(dictionariesUrl + group);
  }

  public styles(): Observable<any[]> {
    return this.httpClient.get<any[]>('assets/data/styles.json');
  }

  public style(slug: string): Observable<any> {
    return this.styles().pipe(
      map(styles => styles.find(style => style.url === slug))
    );
  }

  public stylePaintings(slug: string, page: number = 1): Observable<any> {
    return this.httpClient.get<any>(`${paintingsByStyleUrl}/${slug}/${page}?json=2`);
  }

  public artists() {
    return this.httpClient.get<any[]>(artistsUrl);
  }

  public artist(slug: string) {
    return this.httpClient.get<any[]>(`${baseUrl}/${slug}?json=2`);
  }

  public artistPaintings(slug: string, page: number = 1): Observable<any> {
    return this.httpClient.get<any>(`${paintingsByArtistUrl}?artistUrl=${slug}&json=2`);
  }

  public painting(id: string): Observable<any> {
    return this.httpClient.get<any>(`${paintingUrl}/${id}`);
  }

  public fullImageUrl(url: string): string {
    let newUrl = '';

    if (url) {
      newUrl = url.toLowerCase()
      .replace(/jpg\!.*$/, 'jpg')
      .replace(/png\!.*$/, 'png');

      if (newUrl.includes('/frame-') || newUrl.includes('/artist-')) {
        newUrl = 'assets/images/artist.png';
      }
    }

    return newUrl;
  }

  public smallImageUrl(url: string): string {
    let newUrl = '';

    if (url) {
      newUrl =  url.toLowerCase()
        .replace(/jpg\!.*$/, 'jpg!PortraitSmall.jpg')
        .replace(/png\!.*$/, 'png!PortraitSmall.png');

      if (newUrl.includes('/frame-') || newUrl.includes('/artist-')) {
        newUrl = 'assets/images/artist-thumbnail.png';
      }
    }

    return newUrl;
  }
}

export enum Groups {
  ArtMovement = '1',
  Style = '2',
  Genre = '3',
  Technique = '4',
  PaintingSchoolOrGroup = '7',
  Nation = '10',
  Field  = '11',
}

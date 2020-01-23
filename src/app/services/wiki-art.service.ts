import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
 
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
/**
*
*/
export class WikiArtService {
 
 constructor(
   private platform: Platform,
   private http: HTTP,
   private httpClient: HttpClient,
 ) { }
 
 /**
  * The method gathers the most viewed painting on the WikiArt website
  * @return Observable<any> the most viewed paintings on the WikiArt website
  */
 public  mostedViewedPaintings(): Observable<any[]> {
   return this.httpGet(mostViewedPaintingsUrl);
 }
 
 
 public dictionaries(group: Groups): Observable<any[]> {
   return this.httpGet(dictionariesUrl + group);
 }
 
 /**
  * The method returns the list of art styles.
  * The art styles are defined in the styles json.
  * This includes over 250 art styles like abstract, and cubism, etc.
  */
 public styles(): Observable<any[]> {
   return this.httpClient.get<any[]>('assets/data/styles.json');
 }
 
 /**
  * The method determines the specific art style from the WikiArt slug
  *
  * @param slug The part of the url containing a unique string which
  * identifies an art style from the WikiArt rest API
  */
 public style(slug: string): Observable<any> {
   return this.styles().pipe(
     map(styles => styles.find(style => style.url === slug))
   );
 }
 
 /**
  * The method gathers all artworks under a specific art style.
  *
  * @param slug The part of the url containing a unique string which
  * identifies an art style from the WikiArt rest API
  * @param page The page is always set to 1 since it defines the page the url points to
  */
 public stylePaintings(slug: string, page: number = 1): Observable<any> {
   return this.httpGet(`${paintingsByStyleUrl}/${slug}/${page}?json=2`);
 }
 
 /**
  * The method returns the list of artists in alphabetical order
  */
 public artists() {
   return this.httpGet(artistsUrl);
 }
 
 /**
  * The method determines a specific artist from the WikiArt artist slug
  *
  * @param slug The part of the url containing a unique string which
  * identifies an artist from the WikiArt rest API
  */
 public artist(slug: string) {
   return this.httpGet(`${baseUrl}/${slug}?json=2`);
 }
 
 /**
  * The method determines all the paintings by a specific artists
  * from the WikiArt artist slug
  *
  * @param slug The part of the url containing a unique string which
  * identifies an artist from the WikiArt rest API
  * @param page The page is always set to 1 since it defines the page the url points to
  */
 public artistPaintings(slug: string, page: number = 1): Observable<any> {
   return this.httpGet(`${paintingsByArtistUrl}?artistUrl=${slug}&json=2`);
 }
 
 /**
  * The method gathers a WikiArt painting by a spcific painting id.
  *
  * @param id painting identifier for the WikiArt rest API
  */
 public painting(id: string): Observable<any> {
   return this.httpGet(`${paintingUrl}/${id}`);
 }
 
 /**
  * The method converts a WikiArt image url to its full image size
  * This is done by reconstructing the url so that it doesn't include size
  * indicators in the url such as 'PortraitSmall' after jpg or png
  *
  * @param url an image url, can be a WikiArt image url
  */
 public fullImageUrl(url: string): string {
   let newUrl = '';
 
   if (url) {
     newUrl = url.toLowerCase()
     .replace(/jpg\!.*$/, 'jpg')
     .replace(/png\!.*$/, 'png');
 
     if (newUrl.includes('/frame-') || newUrl.includes('/artist-')) { //not a WikiArt image
       newUrl = 'assets/images/artist.png';
     }
   }
 
   return newUrl;
 }
 /**
  * The method converts the WikiArt image url to include PotraitSmall inorder
  * to make the image smaller.
  *
  * @param url an image url, can be a WikiArt image url
  */
 public smallImageUrl(url: string): string {
   let newUrl = '';
 
   if (url) {
     newUrl =  url.toLowerCase()
       .replace(/jpg\!.*$/, 'jpg!PortraitSmall.jpg')
       .replace(/png\!.*$/, 'png!PortraitSmall.png');
 
     if (newUrl.includes('/frame-') || newUrl.includes('/artist-')) {//not a WikiArt image
       newUrl = 'assets/images/artist-thumbnail.png';
     }
   }
 
   return newUrl;
 }
 
 /**
  * The method was implemented to fix a Cross Orgin Resource Sharing error.
  *
  * @param url WikiArt image url
  */
 private httpGet(url: string): Observable<any> {
   if (this.platform.is('capacitor')) {
     return from(this.http.get(url, null, null)).pipe(
       map(response => JSON.parse(response.data))
     );
   } else {
     return this.httpClient.get(url);
   }
 }
}
 
export enum Groups {
 ArtMovement = '1', //not used
 Style = '2',
 Genre = '3', //not used
 Technique = '4', //not used
 PaintingSchoolOrGroup = '7', //not used
 Nation = '10', //not used
 Field  = '11', //not used
}
 

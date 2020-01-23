import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
 
const baseUrl = 'https://en.wikipedia.org/api/rest_v1';
const pageSummaryUrl = `${baseUrl}/page/summary`;
 
 
@Injectable({
 providedIn: 'root'
})
export class WikipediaService {
 
 constructor(
   private httpClient: HttpClient
 ) { }
 /**
  * Gathers a short summary from Wikpedia using the Wikpedia resource url for the specific style/artist
  * @param pageTitle refrence slug for specific artists/styles
  */
 public pageSummary(pageTitle): Observable<any> {
   return this.httpClient.get<any[]>(`${pageSummaryUrl}/${pageTitle}`);
 }
}
 

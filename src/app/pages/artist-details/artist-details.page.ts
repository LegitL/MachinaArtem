import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { WikiArtService } from '../../services/wiki-art.service';
import { WikipediaService } from '../../services/wikipedia.service';

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.page.html',
  styleUrls: ['./artist-details.page.scss'],
})
export class ArtistDetailsPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  artistSlug: string;
  artist: any;
  wikipediaUrl: string;
  wikipediaPageSummary: any;
  paintings: any[];
  paintingsCount: 0;
  pageSize = 0;
  currentPage = 1;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private wikiArtService: WikiArtService,
    private wikipediaService: WikipediaService,
  ) { }

  ngOnInit() {
    this.artistSlug = this.activatedRoute.snapshot.paramMap.get('slug');
    if (this.artistSlug) {
      this.wikiArtService.artist(this.artistSlug).subscribe(artist => {
        this.artist = artist;
        this.wikipediaUrl = this.artist.wikipediaUrl;
        const wikipediaSlug = decodeURI(this.wikipediaUrl.replace('http://en.wikipedia.org/wiki/', ''));
        this.wikipediaService.pageSummary(wikipediaSlug).subscribe(pageSummary => {
          this.wikipediaPageSummary = pageSummary;
        });
      });
      this.wikiArtService.artistPaintings(this.artistSlug, this.currentPage++).subscribe(data => {
        this.paintings = data;
      });
    }
  }

  public fullImageUrl(url: string): string {
    return this.wikiArtService.fullImageUrl(url);
  }

  public smallImageUrl(url: string): string {
    return this.wikiArtService.smallImageUrl(url);
  }

  public showPainting(painting: any): void {
    const extras: NavigationExtras = { state: { painting} };
    this.router.navigateByUrl('/painting', extras);
  }
}

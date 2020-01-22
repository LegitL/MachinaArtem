import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { WikiArtService } from '../../services/wiki-art.service';
import { WikipediaService } from '../../services/wikipedia.service';

/**
 * This page is responsible for displaying the specific information of each art style in the history
 * Such as the style's name, history, famous artists, and art works related to the style 
 * The sources of the data comes from Wikipedia, which are stored in Wikipedia service
 */

@Component({
  selector: 'app-style-details',
  templateUrl: './style-details.page.html',
  styleUrls: ['./style-details.page.scss'],
})
export class StyleDetailsPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  styleSlug: string;
  style: any;
  wikipediaPageSummary: any;
  paintings: any[];
  paintingsCount: 0;
  currentPage = 1;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private wikiArtService: WikiArtService,
    private wikipediaService: WikipediaService,
  ) { }

  public ngOnInit(): void {
    this.styleSlug = this.activatedRoute.snapshot.paramMap.get('slug');
    if (this.styleSlug) {
      this.wikiArtService.style(this.styleSlug).subscribe(style => {
        this.style = style;
        this.wikipediaService.pageSummary(this.style.wikipediaUrl).subscribe(pageSummary => {
          this.wikipediaPageSummary = pageSummary;
        });
      });
      this.wikiArtService.stylePaintings(this.styleSlug, this.currentPage++).subscribe(data => {
        this.paintings = data.Paintings;
        this.paintingsCount = data.AllPaintingsCount;
      });
    }
  }

  public smallImageUrl(url: string): string {
    return this.wikiArtService.smallImageUrl(url);
  }

  public loadMorePaintings(event): void {
    if (this.paintingsCount > this.paintings.length) {
      this.wikiArtService.stylePaintings(this.styleSlug, this.currentPage++).subscribe(data => {
        this.paintings = [].concat(this.paintings).concat(data.Paintings);
        event.target.complete();
      });
    } else {
      this.infiniteScroll.disabled = true;
    }
  }

  public showPainting(painting: any): void {
    const extras: NavigationExtras = { state: { painting} }
    this.router.navigateByUrl('/painting', extras);
  }
}

import { Component, OnInit } from '@angular/core';
import { WikiArtService } from '../../services/wiki-art.service';
import { NavigationExtras, Router } from '@angular/router';

/**
 * This page is repsonsible for the directive page for the user to enter the artist page or the styles page
 * There will be a small icon on the top, which displays random art pieces from the wiki-art.service. The user can also
 * click on the image to learn more about the displaying image.
 */
@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  paintingOfTheDay: any = null;
  loading = false;

  constructor(
    private router: Router,
    private wikiArtService: WikiArtService
  ) { }

  public ngOnInit(): void {
    this.loading = true;
    this.wikiArtService.mostedViewedPaintings().subscribe(paintings => {
      this.paintingOfTheDay = paintings[Math.floor(Math.random() * paintings.length)];
      this.loading = false;
    });
  }

  public smallImageUrl(url: string): string {
    return this.wikiArtService.smallImageUrl(url);
  }

  public showPainting(painting: any): void {
    const extras: NavigationExtras = { state: { painting} };
    this.router.navigateByUrl('/painting', extras);
  }
}

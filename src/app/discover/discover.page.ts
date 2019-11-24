import { Component, OnInit } from '@angular/core';
import { WikiArtService } from '../services/wiki-art.service';
import { NavigationExtras, Router } from '@angular/router';

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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { WikiArtService } from '../services/wiki-art.service';


const IMAGE_PATTERN = 'wikiart.org/images/';

@Component({
  selector: 'app-painting',
  templateUrl: './painting.page.html',
  styleUrls: ['./painting.page.scss'],
})
export class PaintingPage implements OnInit {
  id: string;
  painting: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private wikiArtService: WikiArtService
  ) { }

  public ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(map(() => window.history.state)).subscribe(state => {
      this.painting = state.painting;
    });
  }

  public getArtistSlug(): string {
    if (this.painting) {
      if (this.painting.artistUrl) {
        return this.painting.artistUrl.substr(4);
      } else {
        let s: string = this.painting.image;
        s = s.substr(s.lastIndexOf(IMAGE_PATTERN) + IMAGE_PATTERN.length);
        s = s.substring(0, s.indexOf('/'));
        return s;
      }
    }
    return '';
  }

  public fullImageUrl(url: string): string {
    return this.wikiArtService.fullImageUrl(url);
  }
}

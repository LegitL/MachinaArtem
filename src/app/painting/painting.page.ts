import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { WikiArtService } from '../services/wiki-art.service';
import { FavoriteStylesService, FavoriteStyle } from '../services/favorite-styles.service';


const IMAGE_PATTERN = 'images/';

@Component({
  selector: 'app-painting',
  templateUrl: './painting.page.html',
  styleUrls: ['./painting.page.scss'],
})
export class PaintingPage implements OnInit {
  id: string;
  painting: any;
  isFavorite: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private wikiArtService: WikiArtService,
    private favoriteStylesService: FavoriteStylesService,
  ) { }

  public ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(map(() => window.history.state)).subscribe(async state => {
      this.painting = state.painting;
      this.isFavorite = await this.favoriteStylesService.hasFavorite(this.getPaintingSlug(this.painting));
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

  public async toggleFavorite(painting): Promise<void> {
    if (this.isFavorite) {
      await this.favoriteStylesService.removeFavorite(this.painting.contentId);
    } else {
      const favorite: FavoriteStyle = {
        slug: this.getPaintingSlug(painting),
        title: painting.title,
        image: painting.image,
        date: painting.yearAsString,
        author: {
          name: painting.artistName,
          bio: ''
        }
      };
      await this.favoriteStylesService.addFavorite(favorite);
    }
    this.isFavorite = !this.isFavorite;
  }

  private getPaintingSlug(painting: any): string {
    let slug: string = painting.image;
    slug = slug.substr(slug.lastIndexOf('/'));
    slug = slug.substring(0, slug.indexOf('.'));
    return slug;
  }
}

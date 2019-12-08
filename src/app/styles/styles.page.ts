import { Component, OnInit } from '@angular/core';
import { WikiArtService, Groups } from '../services/wiki-art.service';

@Component({
  selector: 'app-styles',
  templateUrl: './styles.page.html',
  styleUrls: ['./styles.page.scss'],
})
export class StylesPage implements OnInit {
  allStyles: any[];
  styles: any[];

  constructor(
    private wikiArtService: WikiArtService,
  ) { }

  public ngOnInit(): void {
    this.wikiArtService.styles().subscribe(styles => {
      this.allStyles = styles;
      this.styles = this.groupBy(styles, 'group');
    });
  }

  private groupBy(items: any[], key: string): any[] {
    const groupedMap = items.reduce(
      (entryMap, e) => entryMap.set(
        e[key] === '' ? 'zzz' : e[key],
        [...entryMap.get(e[key] === '' ? 'zzz' : e[key]) || [],
        e]),
      new Map()
    );

    return Array.from(groupedMap.entries()).sort();
  }

  public onSearchTerm(event: any): void {
    this.styles = this.allStyles;
    const val = event.detail.value;
    const styles = this.allStyles.filter(term => {
      return term.title.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
    });
    this.styles = this.groupBy(styles, 'group');
  }


}

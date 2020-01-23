import { Component, OnInit } from '@angular/core';
import { Style } from 'src/app/models/style';
import { CommunityStylesService } from 'src/app/services/community-styles.service';

/**
 * This page is responsible for displaying all publically shared styles. 
 * All the styles avalaible on this page are user contributed, and WikiArt styles will not display on this page.
 * 
 * All of the styles stored Cloud Firestore, under the field of Styles. 
 * To make sure the styles are still avalailble when the user goes offline, there will also be a copy for each style
 * stored in the local storage.
 */

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  styles: Style[];

  constructor(
    private communityStylesService: CommunityStylesService
  ) { }

  public ngOnInit(): void {
    this.communityStylesService.getAllStyles().subscribe(styles => {
      this.styles = styles;
    })
  }

  public showStyle(style: Style): void {
    // TODO: Add navigation to community style detail page.
  }
}

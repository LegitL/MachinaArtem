import { Component, OnInit } from '@angular/core';
import { Style } from 'src/app/models/style';
import { CommunityStylesService } from 'src/app/services/community-styles.service';

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

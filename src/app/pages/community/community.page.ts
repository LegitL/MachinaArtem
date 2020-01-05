import { Component, OnInit } from '@angular/core';
import { Style } from 'src/app/models/style';
import { CommunityStylesService } from 'src/app/services/community-styles.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  
  styles: Style[];

  stopFlagging: boolean;

  constructor(
    private communityStylesService: CommunityStylesService,
    private authService: AuthService
  ) { }

  currentUser = this.authService.getUser();

  public ngOnInit(): void {
    this.communityStylesService.getAllStyles().subscribe(styles => {
      this.styles = styles;
    })

    this.stopFlagging = false;
  }

  public showStyle(style: Style): void {
    // TODO: Add navigation to community style detail page.
  }

  public flag (style: Style): void {

    style.flag ++;

    console.log(style.flag)

    if (style.flag >= 5){

      this.communityStylesService.flagStyle(style);

      console.log(style.title + " by " + style.author.name + " has been removed ")

      style.isPublic = false;

    }
  }

  public userOverclickPrevention(index: number){

    var user = this.authService.getUser();

  }
}

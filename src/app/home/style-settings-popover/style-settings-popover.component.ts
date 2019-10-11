import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-style-settings-popover',
  templateUrl: './style-settings-popover.component.html',
  styleUrls: ['./style-settings-popover.component.scss'],
})
export class StyleSettingsPopoverComponent {
  styleAmount: number;
  styleSize: number;

  constructor(
    private popoverController: PopoverController
  ) { }

  public changeStyleAmount(event: any): void {
    this.styleAmount = event.target.value;
  }

  public changeStyleSize(event: any): void {
    this.styleSize = event.target.value;
  }

  public save(): void {
    this.popoverController.dismiss({
      styleAmount: this.styleAmount,
      styleSize: this.styleSize
    })
  }
}

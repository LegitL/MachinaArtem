import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import * as mi from '@magenta/image';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  loader: HTMLIonLoadingElement;
  model: any;
  selectedStyleIndex: number;
  resultHeight = 0;
  resultWidth = 0;
  styleRatio = 1.0;
  photo: SafeResourceUrl = 'https://picsum.photos/414/736';

  sliderImageOptions = {
    zoom: {
      maxRatio: 3
    }
  }

  slidesStylesOptions = {
    spaceBetween: 10,
    slidesPerView: 3.4,
  };
 
  
  constructor(
    private sanitizer: DomSanitizer,
    private loadingController: LoadingController
  ) {  }

  public ngOnInit(): void {
    this.model = new mi.ArbitraryStyleTransferNetwork();
    console.log(this.model);
    this.model.initialize();
  }
  
  public async takePicture(): Promise<void> {
    const image = await Plugins.Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
  }

  public slideStyleTap(styleIndex: number): void {
    console.log(styleIndex);
    this.selectedStyleIndex = styleIndex;

    const originalImg = document.getElementById('original') as HTMLImageElement;
    const styleImg = document.getElementById('style') as HTMLImageElement;

    styleImg.style.setProperty('height',  (originalImg.height * this.styleRatio) + 'px');
  }

  public async stylize(): Promise<void >{
    await this.showLoader();

    const originalImg = document.getElementById('original') as HTMLImageElement;
    const resultCanvas = document.getElementById('result') as HTMLCanvasElement;
    const styleImg = document.getElementById('style') as HTMLImageElement;
    const strength = 0.5;

    this.resultHeight = originalImg.height;
    this.resultWidth = originalImg.width;

    resultCanvas.style.setProperty('top', originalImg.offsetTop + 'px');
    resultCanvas.style.setProperty('left', originalImg.offsetLeft + 'px');

    // Use timout:0 to give a chance for canvas size to be set by javascript event queue.
    setTimeout(() => {
      this.model.stylize(originalImg, styleImg, strength).then((imageData: ImageData) => {
        resultCanvas.getContext('2d').putImageData(imageData, 0, 0);
        this.hideLoader();
      })
    }, 0)
  }

  public prepareCanvas(): void {
    const resultCanvas = document.getElementById('result') as HTMLCanvasElement;
    const context = resultCanvas.getContext('2d');
    context.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    delete this.selectedStyleIndex;
  }

  public shuffleImage(): void {
    this.photo = `https://picsum.photos/414/736?${Math.random()}`;
  }

  private async showLoader() {
    this.loader = await this.loadingController.create({
      message: 'Stylizing...',
      translucent: true,
    });
    return await this.loader.present();
  }

  private hideLoader() {
    this.loader.dismiss();
  }


  styles = [
    {
      title: 'Style One',
      imgUrl: '/assets/images/styles/1.jpg'
    },
    {
      title: 'Style Two',
      imgUrl: '/assets/images/styles/2.jpg'
    },
    {
      title: 'Nice Style',
      imgUrl: '/assets/images/styles/3.jpg'
    },
    {
      title: 'Really?',
      imgUrl: '/assets/images/styles/4.jpg'
    },
    {
      title: 'Abstract',
      imgUrl: '/assets/images/styles/5.jpg'
    },
    {
      title: 'French',
      imgUrl: '/assets/images/styles/6.jpg'
    },
    {
      title: 'Irish',
      imgUrl: '/assets/images/styles/7.jpg'
    },
    {
      title: 'What and Why',
      imgUrl: '/assets/images/styles/8.jpg'
    },
    {
      title: 'Long, long, long, and long style',
      imgUrl: '/assets/images/styles/9.jpg'
    },
    {
      title: 'Looly tyle',
      imgUrl: '/assets/images/styles/10.jpg'
    },
    {
      title: 'Yander',
      imgUrl: '/assets/images/styles/11.jpg'
    },
    {
      title: 'Fools Art',
      imgUrl: '/assets/images/styles/12.jpg'
    },
    {
      title: 'Abstract not',
      imgUrl: '/assets/images/styles/13.jpg'
    },
    {
      title: 'flower time',
      imgUrl: '/assets/images/styles/14.jpg'
    },
    {
      title: 'Yellow',
      imgUrl: '/assets/images/styles/15.jpg'
    },
    {
      title: 'Hover Over',
      imgUrl: '/assets/images/styles/16.jpg'
    },
    {
      title: 'Are those yours?',
      imgUrl: '/assets/images/styles/17.jpg'
    },
    {
      title: 'My Dad Vladimir',
      imgUrl: '/assets/images/styles/18.jpg'
    },
    {
      title: 'Hey it is me',
      imgUrl: '/assets/images/styles/19.jpg'
    },
    {
      title: 'Bob',
      imgUrl: '/assets/images/styles/20.jpg'
    },
    {
      title: 'Couch',
      imgUrl: '/assets/images/styles/21.jpg'
    },
    {
      title: 'Stop Light',
      imgUrl: '/assets/images/styles/22.jpg'
    },
    {
      title: 'Red Socks',
      imgUrl: '/assets/images/styles/23.jpg'
    },
  ];

}

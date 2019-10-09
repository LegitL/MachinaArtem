import { Component } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  photo: SafeResourceUrl = 'https://picsum.photos/414/736ionic cap ';
  
  constructor(private sanitizer: DomSanitizer) {  }
  
  public async takePicture(): Promise<void> {
    const image = await Plugins.Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
  }

  sliderImageOptions = {
    zoom: {
      maxRatio: 2
    }
  }

  slidesStylesOptions = {
    spaceBetween: 10,
    slidesPerView: 3.4,
//    loop: true,np
//    freeMode: true,
    loopedSlides: 5, //looped slides should be the same
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
  };
 
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

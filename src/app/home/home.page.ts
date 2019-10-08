import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  slidesOptions = {
    spaceBetween: 10,
    slidesPerView: 4,
//    loop: true,np
//    freeMode: true,
    loopedSlides: 5, //looped slides should be the same
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
  };

  styles = [
    {
      title: 'Style One',
      imgUrl: 'https://picsum.photos/200?random=1'
    },
    {
      title: 'Style Two',
      imgUrl: 'https://picsum.photos/200?random=2'
    },
    {
      title: 'Nice Style',
      imgUrl: 'https://picsum.photos/200?random=3'
    },
    {
      title: 'Really?',
      imgUrl: 'https://picsum.photos/200?random=4'
    },
    {
      title: 'Abstract',
      imgUrl: 'https://picsum.photos/100?random=5'
    },
    {
      title: 'French',
      imgUrl: 'https://picsum.photos/100?random=6'
    },
    {
      title: 'Irish',
      imgUrl: 'https://picsum.photos/100?random=7'
    },
    {
      title: 'What and Why',
      imgUrl: 'https://picsum.photos/100?random=8'
    },
    {
      title: 'Long, long, long, and long style',
      imgUrl: 'https://picsum.photos/100?random=9'
    },
  ];

  constructor() {}

}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent
{
  @Input() items: any[] | null = [
    { title: 'Đắc Nhân Tâm', description: 'Đắc Nhân Tâm', image: 'https://cdn2.unrealengine.com/egs-fall-guys-season-4-desktop-1248x702-59af3c5b2e50.jpg?h=720&quality=medium&resize=1&w=1280' },
    { title: 'Cô Bé Lọ Lem', description: 'Cô Bé Lọ Lem', image: 'https://cdn2.unrealengine.com/egs-fall-guys-season-4-desktop-1248x702-59af3c5b2e50.jpg?h=720&quality=medium&resize=1&w=1280' },
    { title: 'Angela Merkel - Thế Giới Của Vị Nữ Thủ Tướng', description: 'Angela Merkel - Thế Giới Của Vị Nữ Thủ Tướng', image: 'https://cdn2.unrealengine.com/egs-fall-guys-season-4-desktop-1248x702-59af3c5b2e50.jpg?h=720&quality=medium&resize=1&w=1280' },
    { title: 'Tắt Đèn', description: 'Tắt Đèn', image: 'https://cdn2.unrealengine.com/egs-fall-guys-season-4-desktop-1248x702-59af3c5b2e50.jpg?h=720&quality=medium&resize=1&w=1280' },
    { title: 'Trò Đùa Của Sự Ngẫu Nhiên', description: 'Trò Đùa Của Sự Ngẫu Nhiên', image: 'https://cdn2.unrealengine.com/egs-fall-guys-season-4-desktop-1248x702-59af3c5b2e50.jpg?h=720&quality=medium&resize=1&w=1280' },
  ];
  mainConfig = {
    lazyLoad: 'ondemand',
    infinite: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 250,
  }
  active = 0;

  slickInit (e: any)
  {
    console.log(e);

  }

  beforeChange (e: any)
  {
    this.active = e.currentSlide;
  }
}

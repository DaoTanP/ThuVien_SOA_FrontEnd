import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Book } from 'src/app/models/book';

@Component({
  selector: 'app-book-scroll-list',
  templateUrl: './book-scroll-list.component.html',
  styleUrls: ['./book-scroll-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BookScrollListComponent
{
  @Input() title: string = 'Book Scroll List';
  @Input() href: string = '';
  @Input('data') bookList: Book[] | undefined = undefined;
  @Input('dataAsync') bookListAsync: Observable<Book[]> | undefined = undefined;

  slideConfig = {
    slidesToShow: 7,
    slidesToScroll: 7,
    infinite: false,
    arrows: false,
    draggable: false,
    speed: 500,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        // breakpoint: 424,
        breakpoint: 280,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]

  };

  slickInit (e: any)
  {
  }
  breakpoint (e: any)
  {
  }
  afterChange (e: any)
  {
  }
  beforeChange (e: any)
  {
  }
}

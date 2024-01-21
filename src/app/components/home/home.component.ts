import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { Book } from 'src/app/models/book';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent
{
  protected searchInput: string = '';
  protected topBorrowList: Observable<any> = of([]);
  protected randomRecommendationList: Observable<any> = of([]);
  protected carouselItems: any[] | null = null;

  constructor(private httpService: HttpService, private router: Router)
  {
    // this.topBorrowList = this.httpService.getTopBorrow();
    this.randomRecommendationList = this.httpService.GetRandom(10);
    this.httpService.GetRandom(5).subscribe(items =>
    {
      this.carouselItems = items.map((item: Book) =>
      {
        return {
          title: item.title,
          description: item.author.join(', '),
          image: item.images[0],
          href: '/book/' + item._id,
        }
      });
    });
  }

  search ()
  {
    if (!this.searchInput || this.searchInput === '')
      return;

    this.router.navigate(['/search'], { queryParams: { title: this.searchInput } });
  }
}

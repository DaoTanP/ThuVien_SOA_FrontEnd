import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
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

  constructor(private httpService: HttpService, private router: Router)
  {
    this.topBorrowList = this.httpService.getTopBorrow();
    this.randomRecommendationList = this.httpService.GetRandomRecommendation();
  }

  search ()
  {
    if (!this.searchInput || this.searchInput === '')
      return;

    this.router.navigate(['/search'], { queryParams: { title: this.searchInput } });
  }
}

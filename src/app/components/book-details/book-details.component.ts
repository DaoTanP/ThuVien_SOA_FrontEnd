import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Book } from 'src/app/models/book';
import { SearchModel } from 'src/app/models/search-model';
import { AlertService, AlertType } from 'src/app/services/alert.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { HttpService } from 'src/app/services/http.service';
import { convertJSToCSDate, convertToJSDateString } from 'src/app/models/Utils';


@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent
{
  protected userId: string | undefined = undefined;
  protected cardNumber: string | undefined = undefined;
  protected book: Book = new Book();
  protected publishDate: string | undefined = undefined;
  protected isFavorite: boolean = false;
  protected isInCart: boolean = false;
  protected waitingForFavoriteAction = false;
  protected waitingForCartAction = false;
  protected waitingForBorrowAction = false;

  protected inCategory: Observable<Book[]> = of([]);
  protected fromAuthor: Observable<Book[]> = of([]);
  protected fromPublisher: Observable<Book[]> = of([]);

  protected borrowDate: FormControl = new FormControl(convertToJSDateString(new Date()), [Validators.required]);
  protected returnDate: FormControl = new FormControl(null, [Validators.required]);


  protected borrowForm: FormGroup = new FormGroup({
    borrowDate: this.borrowDate,
    returnDate: this.returnDate,
  });

  constructor(
    private httpService: HttpService,
    private authGuardService: AuthGuardService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  )
  {
    // force route reload whenever params change
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.waitingForFavoriteAction = true;
    this.waitingForCartAction = true;
    this.route.paramMap.subscribe(params =>
    {
      const id = params.get('id') || '';
      const categorySearch = new SearchModel();
      const authorSearch = new SearchModel();
      const publisherSearch = new SearchModel();

      this.httpService.getBooks(id).subscribe(book =>
      {
        this.book = book;
        this.publishDate = new Date(book.publishDate).toLocaleDateString();

        if (authGuardService.isLoggedIn)
          authGuardService.userData.subscribe({
            next: res =>
            {
              this.httpService.isFavorite(this.book._id).subscribe(fav => this.isFavorite = fav);
              this.userId = res._id;
              this.cardNumber = res.cardId;
            }
          });

        this.waitingForFavoriteAction = false;
        this.waitingForCartAction = false;

        categorySearch.category = this.book.category;
        authorSearch.author = this.book.author;
        publisherSearch.publisher = this.book.publisher;

        this.inCategory = this.httpService.searchBooks(categorySearch);
        this.fromAuthor = this.httpService.searchBooks(authorSearch);
        this.fromPublisher = this.httpService.searchBooks(publisherSearch);
      });
    });
  }

  addFavorite ()
  {
    if (!this.authGuardService.isLoggedIn)
    {
      this.router.navigate(['/login']);
      return;
    }

    this.waitingForFavoriteAction = true;
    this.httpService.addFavorite(this.book._id).subscribe({
      next: res =>
      {
        this.waitingForFavoriteAction = false;
        this.isFavorite = true;
      }, error: err =>
      {
        this.waitingForFavoriteAction = false;
        this.alertService.appendAlert('Đã xảy ra lỗi, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
      }
    });
  }

  removeFavorite ()
  {
    if (!this.authGuardService.isLoggedIn)
    {
      this.router.navigate(['/login']);
      return;
    }

    this.waitingForFavoriteAction = true;
    this.httpService.removeFavorite(this.book._id).subscribe({
      next: res =>
      {
        this.waitingForFavoriteAction = false;
        this.isFavorite = false;
      }, error: err =>
      {
        this.waitingForFavoriteAction = false;
        this.alertService.appendAlert('Đã xảy ra lỗi, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
      }
    });
  }

  borrowEvent ()
  {
    if (!this.userId)
    {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.cardNumber)
    {
      this.alertService.appendAlert('Vui lòng liên kết thẻ thư viện trước khi mượn sách', AlertType.danger, 10, 'alert-container');
      return;
    }
  }

  borrow ()
  {
    this.waitingForBorrowAction = true;
    const formData = this.borrowForm.value;
    const data = {
      cardNumber: this.cardNumber,
      bookId: this.book._id,
      borrowDate: formData.borrowDate,
      returnDate: formData.returnDate
    }
    console.log(data);
    
    this.httpService.borrow(data).subscribe({
      next: res =>
      {
        this.waitingForBorrowAction = false;
        this.alertService.appendAlert('Đăng ký mượn thành công, mang thẻ đến thư viện để nhận sách', AlertType.success, 10, 'alert-container');
      }, error: err =>
      {
        this.waitingForBorrowAction = false;
        this.alertService.appendAlert('Đã xảy ra lỗi, vui lòng thử lại sau', AlertType.danger, 5, 'alert-container');
      }
    });
  }
}
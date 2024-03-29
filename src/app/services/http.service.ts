import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService
{
  private BOOK_API_URL = 'http://localhost:3000/book';
  private USER_API_URL = 'http://localhost:3000/user';
  private BORROW_API_URL = 'http://localhost:3000/borrow';
  private requestHeaders = {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  }

  constructor(private httpClient: HttpClient, private dataService: DataService) { }

  public login (user: User): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/login', user, /* { observe: 'response', responseType: "text" } */);
  }

  public register (user: User): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/register', user);
  }

  public usernameAvailable (username: string): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + "/usernameAvailable", { username }, { observe: 'response', responseType: "text" });
  }

  public getUserInfo (id: string = ''): Observable<any>
  {
    console.log('requesting user info');

    if (id != '')
      return this.httpClient.get(this.USER_API_URL, { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  } });

    return this.httpClient.get(this.USER_API_URL + '/' + id, { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  } });
  }

  public editUserInfo (userInfoChanges: any): Observable<any>
  {
    return this.httpClient.patch(this.USER_API_URL, userInfoChanges, { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  } });
  }

  public deleteUser (): Observable<any>
  {
    return this.httpClient.delete(this.USER_API_URL, { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  }, observe: 'response', responseType: "text" });
  }

  public uploadAvatar (image: any): Observable<any>
  {
    return this.httpClient.patch(this.USER_API_URL, image, { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  } });
  }

  public getBooks (id: string = ''): Observable<any>
  {
    if (id != '')
      return this.httpClient.get(this.BOOK_API_URL + '/' + id);

    return this.httpClient.get(this.BOOK_API_URL);
  }

  public GetRandom (numberOfBooks = 1): Observable<any>
  {
    return this.httpClient.get(this.BOOK_API_URL + '/random?n=' + numberOfBooks);
  }

  public getCategories (): Observable<any>
  {
    return this.httpClient.get(this.BOOK_API_URL + '/category');
  }

  public searchBooks (searchModel: any): Observable<any>
  {
    // remove all null properties
    const sm = Object.keys(searchModel)
      .filter((k) => searchModel[k] != null)
      .reduce((a, k) => ({ ...a, [k]: searchModel[k] }), {});

    return this.httpClient.get(this.BOOK_API_URL, { params: sm });
  }

  public addFavorite (bookId: any): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/addFavorite', { bookId }, { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  } });
  }
  public removeFavorite (bookId: any): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/removeFavorite', { bookId }, { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  } });
  }
  public isFavorite (bookId: any): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/isFavorite', { bookId }, { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  } });
  }
  public getFavorite (): Observable<any>
  {
    return this.httpClient.get(this.USER_API_URL + '/favorite', { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  } });
  }

  public linkLibraryCard ({ cardId, cardPassword }: any): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/libraryCard', { cardId, cardPassword }, { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  } });
  }

  public unlinkLibraryCard (): Observable<any>
  {
    return this.httpClient.delete(this.USER_API_URL + '/libraryCard', { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  } });
  }

  public borrow ({ bookId, borrowDate, returnDate }: any): Observable<any>
  {
    return this.httpClient.post(this.BORROW_API_URL, { bookId, borrowDate, returnDate }, { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  } });
  }

  public borrowHistory (): Observable<any>
  {
    return this.httpClient.get(this.BORROW_API_URL + '/history', { headers: {
    'Authorization': 'Bearer ' + this.dataService.getSession('access_token'),
  } });
  }
}

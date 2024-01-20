import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { SearchModel } from '../models/search-model';

@Injectable({
  providedIn: 'root'
})
export class HttpService
{
  // private BOOK_API_URL = 'https://express-api.dao-tan-phattan.repl.co/books';
  // private USER_API_URL = 'https://express-api.dao-tan-phattan.repl.co/authentication';
  private BOOK_API_URL = 'http://localhost:8080/api/book';
  private USER_API_URL = 'http://localhost:8080/api/user';

  constructor(private httpClient: HttpClient) { }

  public login (user: User): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/login', user, /* { observe: 'response', responseType: "text" } */);
  }

  public usernameExists (username: string): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + "/usernameExists", { username });
  }

  public register (user: User): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL, user);
  }

  public getUserData (id: string): Observable<any>
  {
    console.log('requesting user data');

    return this.httpClient.get(this.USER_API_URL + '/' + id);
  }

  public editUser (user: any): Observable<any>
  {
    return this.httpClient.patch(this.USER_API_URL, user);
  }

  public deleteUser (user: User): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/delete', user, { observe: 'response', responseType: "text" });
  }

  public uploadAvatar ({ username, imageBytes }: any): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/uploadAvatar', { username, imageBytes });
  }

  public changeUserPassword ({ username, oldPassword, newPassword }: any): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/changePassword', { username, oldPassword, newPassword }, { observe: 'response', responseType: "text" });
  }

  public linkLibraryCard ({ CardNumber, Password, UserId }: any): Observable<any>
  {
    return this.httpClient.post(this.USER_API_URL + '/libraryCard', { CardNumber, Password, UserId });
  }

  public getBooks (id: string = ''): Observable<any>
  {
    if (id != '')
      return this.httpClient.get(this.BOOK_API_URL + '/' + id);

    return this.httpClient.get(this.BOOK_API_URL);
  }

  public getTopBorrow (): Observable<any>
  {
    return this.httpClient.get(this.BOOK_API_URL + '/topBorrow');
  }

  public GetRandomRecommendation (): Observable<any>
  {
    return this.httpClient.get(this.BOOK_API_URL + '/randomRecommendation');
  }

  public getCategories (): Observable<any>
  {
    return this.httpClient.get(this.BOOK_API_URL + '/category');
  }

  public getAuthors (): Observable<any>
  {
    return this.httpClient.get(this.BOOK_API_URL + '/author');
  }

  public getPublishers (): Observable<any>
  {
    return this.httpClient.get(this.BOOK_API_URL + '/publisher');
  }

  public searchBooks (searchModel: SearchModel): Observable<any>
  {
    for (let i in searchModel)
    {
      if (searchModel[i] === null)
        searchModel[i] = '';
    }

    return this.httpClient.get(this.BOOK_API_URL + '/search', { params: searchModel });
  }

  public addFavorite ({ bookId, userId }: any): Observable<any>
  {
    const id = null;
    return this.httpClient.post(this.USER_API_URL + '/addFavorite', { id, bookId, userId });
  }
  public removeFavorite ({ bookId, userId }: any): Observable<any>
  {
    const id = null;
    return this.httpClient.post(this.USER_API_URL + '/removeFavorite', { id, bookId, userId });
  }
  public isFavorite ({ bookId, userId }: any): Observable<any>
  {
    const id = null;
    return this.httpClient.post(this.USER_API_URL + '/isFavorite', { id, bookId, userId });
  }
  public getFavorite (id: string): Observable<any>
  {
    return this.httpClient.get(this.USER_API_URL + `/${id}/favorite`);
  }

  public borrow ({ cardNumber, bookId, borrowDate, returnDate }: any): Observable<any>
  {
    return this.httpClient.post(this.BOOK_API_URL + '/borrow', { id: null, cardNumber, bookId, borrowDate, returnDate });
  }
}

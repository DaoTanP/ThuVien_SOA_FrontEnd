import { Injectable } from '@angular/core';
import
{
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { DataService } from '../services/data.service';
import { User } from '../models/user';
import { HttpService } from './http.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate
{
  private user: Observable<User | undefined> = of(undefined);
  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private router: Router,
  )
  {
    this.initData();
  }

  get isLoggedIn (): boolean
  {
    return (this.dataService.getSession('access_token') !== null);
  }

  get userData (): Observable<any>
  {
    console.log('getting user data...');
    return this.user;
  }

  set userData (userData: any)
  {
    this.user = of(userData);
  }

  initData ()
  {
    const accessToken = this.dataService.getSession('access_token');

    if (accessToken)
      this.user = this.httpService.getUserInfo();
  }

  login (accessToken: string): void
  {
    if (!accessToken)
      return;

    this.dataService.setSession('access_token', accessToken);
    this.user = this.httpService.getUserInfo();
  }

  logOut (): void
  {
    this.dataService.removeSession('access_token');
    this.user = of(undefined);
  }

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean
  {
    if (!this.isLoggedIn)
    {
      this.router.navigate(['login']);
    }

    return this.isLoggedIn;
  }
}
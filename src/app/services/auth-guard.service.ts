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
  constructor(private dataService: DataService, private httpService: HttpService, private router: Router)
  {
    this.initData();
  }

  get isLoggedIn (): boolean
  {
    return (this.dataService.getSession('userId') !== null);
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
    const userId = this.dataService.getSession('userId');

    if (userId)
      this.user = this.httpService.getUserData(userId);
  }

  login (userId: string): void
  {
    if (!userId)
      return;

    this.dataService.setSession('userId', userId);
    this.user = this.httpService.getUserData(userId);
  }

  logOut (): void
  {
    this.dataService.removeSession('userId');
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
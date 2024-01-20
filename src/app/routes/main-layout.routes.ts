import { Routes } from "@angular/router";
import { HomeComponent } from "../components/home/home.component";
import { BookDetailsComponent } from "../components/book-details/book-details.component";
import { BookSearchComponent } from "../components/book-search/book-search.component";
import { ProfileComponent } from "../components/profile/profile.component";
import { AuthGuardService } from "../services/auth-guard.service";

export const mainLayoutRoute: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'search', component: BookSearchComponent },
    { path: 'book', component: BookDetailsComponent },
    { path: 'book/:id', component: BookDetailsComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
]
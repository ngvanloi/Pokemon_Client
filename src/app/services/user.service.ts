import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { IUser } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.apiUrl;

  private currentUserSource = new ReplaySubject<IUser | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private readonly http: HttpClient, private readonly router: Router) { }

  getCurrentUser(token: string | null): Observable<IUser | null> {
    if (!token) {
      this.currentUserSource.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", `Bearer ${token}`);

    return this.http.get<IUser | null>(this.baseUrl + "user", { headers })
      .pipe(
        map((user: any) => {
          if (user.data) {
            localStorage.setItem("access_token", user.data.accessToken);
            this.currentUserSource.next(user.data);
          }
          return user;
        })
      )
  }

  login(values: any): Observable<IUser> {
    return this.http.post<IUser>(this.baseUrl + 'user/sign-in', values)
      .pipe(
        map((user: any) => {
          if (user) {
            localStorage.setItem("access_token", user.data.accessToken);
            this.currentUserSource.next(user.data);
          }
          return user;
        }),
        catchError((error) => {
          console.error('Failed to retrieve user from server:', error);
          return of();
        })
      )
  }

  register(values: any): Observable<IUser> {
    return this.http.post<IUser>(this.baseUrl + 'user/sign-up', values)
      .pipe(
        map((user: any) => {
          if (user) {
            localStorage.setItem('access_token', user.data.accessToken);
            this.currentUserSource.next(user.data);
          }
          return user;
        }),
        catchError((error) => {
          console.error('Failed to register:', error);
          return of();
        })
      )
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl("/login");
  }
}

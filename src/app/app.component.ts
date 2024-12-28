import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from "./components/partials/footer/footer.component";
import { UserService } from './services/user.service';
import { catchError, Observable, of, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  accessToken: string | null | undefined;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly userService: UserService,
    private loadingService: LoadingService
  ) {
    this.loading$ = this.loadingService.loading$;

  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadCurrentUser() {
    this.accessToken = localStorage.getItem('access_token');

    this.userService.getCurrentUser(this.accessToken)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((error) => {
          console.error('Failed to retrieve user:', error);
          return of(null);
        })
      )
      .subscribe();
  }
}

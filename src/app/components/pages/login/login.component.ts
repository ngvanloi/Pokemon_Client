import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { TextInputComponent } from "../../partials/text-input/text-input.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, TextInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  returnUrl: string = '/pokemon';

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pokemon';
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("^\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}$")]),
      password: new FormControl('', Validators.required),
    })
  }

  onSubmit() {
    if (!this.loginForm) return;
    console.log(this.loginForm.value);

    this.userService.login(this.loginForm.value)
      .pipe(
        tap(() => {
          this.router.navigateByUrl(this.returnUrl);
          console.log('user login');
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe();
  }

}

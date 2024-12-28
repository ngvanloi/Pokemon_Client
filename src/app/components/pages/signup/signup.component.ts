import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from "../../partials/text-input/text-input.component";
import { PasswordsMatchValidator } from '../../../validators/passwords-match-validator';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TextInputComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  errors: string[] = [];
  returnUrl: string = '/pokemon';

  private unsubscribe$: Subject<void> = new Subject<void>();
  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.createRegisterForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['',
        [Validators.required, Validators.pattern("^\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}$")]
      ],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: PasswordsMatchValidator('password', 'confirmPassword')
    });
  }

  onSubmit() {
    if (!this.registerForm) return;

    this.userService.register(this.registerForm.value)
      .pipe(
        tap(() => {
          this.router.navigateByUrl(this.returnUrl);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }
}

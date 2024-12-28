import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) { } // Inject toastr service (optional)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle different error status codes
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // Client-side or network error
          errorMessage = `Client-side error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = 'Bad Request. Please check your input.';
              break;
            case 401:
              errorMessage = 'Unauthorized. Please login again.';
              break;
            case 404:
              errorMessage = 'Resource not found.';
              break;
            case 413:
              errorMessage = 'File is too large. Please upload a smaller file';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              errorMessage = `Unexpected error: ${error.statusText}`;
              break;
          }
        }

        // Optionally, you can log the error to an external service (e.g., Sentry, LogRocket, etc.)

        // Show a user-friendly error message using Toastr (optional)
        this.toastr.error(errorMessage, 'Error', {
          timeOut: 5000,
        });

        // Return the error message to the subscriber
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

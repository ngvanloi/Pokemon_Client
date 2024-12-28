import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private loadingService: LoadingService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Show loading indicator when the request is made
        this.loadingService.showLoading();

        return next.handle(req).pipe(
            delay(500),
            tap({
                next: (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // Hide loading when the response is successful
                        this.loadingService.hideLoading();
                    }
                },
                error: (error) => {
                    // Hide loading on error response
                    this.loadingService.hideLoading();
                },
            })
        );
    }
}

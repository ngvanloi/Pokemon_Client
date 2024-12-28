import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { IType } from "../models/type.model";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllTypes(): Observable<IType[]> {
    return this.http.get<IType[]>(this.baseUrl + "type").pipe(
      catchError((error) => {
        console.error('Failed to retrieve Types from server:', error);
        return of();
      }));
  }

  createManyTypes(types: string[]): Observable<void> {
    return this.http.post<void>(this.baseUrl + "type", { types: types })
      .pipe(
        catchError((error) => {
          console.error('Failed to create Types from server:', error);
          return of();
        }));
  }
}

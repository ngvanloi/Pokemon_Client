import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { catchError, map, Observable, of } from "rxjs";
import { IPokemon } from "../models/pokemon.model";

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllPokemons(queryParams: any): Observable<IPokemon[]> {
    let params = new HttpParams();

    if (queryParams) {
      for (const key in queryParams) {
        if (queryParams[key]) {
          params = params.append(key, queryParams[key].toString());
        }
      }
    }
    return this.http.get<IPokemon[]>(this.baseUrl + "pokemon", { params }).pipe(
      catchError((error) => {
        console.error('Failed to retrieve Pokemons from server:', error);
        return of();
      }));
  }

  createManyPokemons(pokemons: IPokemon[]): Observable<void> {
    return this.http.post<void>(this.baseUrl + "pokemon", { pokemons: pokemons })
      .pipe(
        catchError((error) => {
          console.error('Failed to create Pokemons from server:', error);
          return of();
        }));
  }
}

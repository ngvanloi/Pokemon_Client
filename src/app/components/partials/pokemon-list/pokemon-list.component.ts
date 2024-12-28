import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../../services/pokemon.service';
import { IPokemon } from '../../../models/pokemon.model';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TypeService } from '../../../services/type.service';
import { IType } from '../../../models/type.model';
import { IFilter } from '../../../models/filter.model';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})
export class PokemonListComponent implements OnInit {
  pokemons: IPokemon[] = [];
  types: IType[] = [];
  filters: IFilter = {
    limit: 10,
    page: 0,
    sort: undefined,
    type: undefined,
    isLegendary: false,
    speedRange: 0,
    searchName: ''
  }
  searchTerm$ = new Subject<IFilter>();

  constructor(private pokemonService: PokemonService, private typeService: TypeService) { }

  ngOnInit(): void {
    this.searchTerm$
      .pipe(
        debounceTime(300),
        switchMap((filters) => {
          return this.pokemonService.getAllPokemons(filters);
        })
      )
      .subscribe((res: any) => {
        this.pokemons = res.data;
      });

    this.loadTypes();
    this.loadPokemons();
  }

  loadTypes(): void {
    this.typeService.getAllTypes()
      .pipe(tap((res: any) => {
        this.types = res.data;
      })).subscribe();
  }

  loadPokemons(): void {
    this.pokemonService.getAllPokemons(this.filters)
      .pipe(tap((res: any) => {
        this.pokemons = res.data;
      })).subscribe();
  }

  onSearch() {
    this.searchTerm$.next(this.filters);
  }

  viewPokemonDetails(id: string): void {
    // Logic to view details
    alert(`Viewing details for Pokémon with ID: ${id}`);
  }

}

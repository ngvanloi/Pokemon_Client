import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../../services/pokemon.service';
import { IPokemon } from '../../../models/pokemon.model';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TypeService } from '../../../services/type.service';
import { IType } from '../../../models/type.model';
import { IFilter } from '../../../models/filter.model';
import { PaginationComponent } from "../pagination/pagination.component";

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})
export class PokemonListComponent implements OnInit {
  pokemons: IPokemon[] = [];
  types: IType[] = [];
  filters: IFilter = {
    limit: 20,
    page: 1,
    sort: undefined,
    type: undefined,
    isLegendary: false,
    speedRange: 0,
    searchName: ''
  }
  searchTerm$ = new Subject<IFilter>();

  totalPokemons = 0;
  totalPages = 1;
  itemsPerPageOptions = [10, 20, 50, 100];

  constructor(private pokemonService: PokemonService, private typeService: TypeService) { }

  ngOnInit(): void {
    this.searchTerm$
      .pipe(
        debounceTime(300),
        switchMap((filters) => {
          return this.pokemonService.getAllPokemons(filters)
            .pipe(
              tap((res: any) => {
                this.pokemons = res.data;
                this.totalPokemons = res.total;
                this.totalPages = res.totalPage;
              })
            );
        })
      )
      .subscribe();

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

  onPageChange(newPage: number): void {
    this.filters.page = newPage;
    this.searchTerm$.next(this.filters);

  }

  onItemsPerPageChange(newItemsPerPage: number): void {
    this.filters.limit = newItemsPerPage;
    this.filters.page = 1; // Reset to the first page
    this.searchTerm$.next(this.filters);
  }

}

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
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonModalComponent } from "../pokemon-modal/pokemon-modal.component";

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, PokemonModalComponent],
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
    minSpeed: 0,
    maxSpeed: 1000,
    searchName: ''
  }
  searchTerm$ = new Subject<IFilter>();

  totalPokemons = 0;
  totalPages = 1;
  itemsPerPageOptions = [10, 20, 50, 100];

  selectedPokemon: IPokemon | null = null;
  showModal = false;

  constructor(
    private pokemonService: PokemonService,
    private typeService: TypeService,
    private router: Router,
    private route: ActivatedRoute) { }

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
    this.initializeFiltersFromQueryParams();
    this.loadTypes();
    this.loadPokemons();
  }

  initializeFiltersFromQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      this.filters.page = +params['page'] || 1;
      this.filters.limit = +params['limit'] || 20;
      this.filters.searchName = params['searchName'] || '';
      this.filters.type = params['type'] || '';
      this.filters.isLegendary = params['isLegendary'] === 'true';
      this.filters.minSpeed = +params['minSpeed'] || 0;
      this.filters.maxSpeed = +params['maxSpeed'] || 1000;
    });
  }

  updateQueryParams(): void {
    const queryParams = {
      page: this.filters.page,
      limit: this.filters.limit,
      searchName: this.filters.searchName || undefined,
      type: this.filters.type || undefined,
      isLegendary: this.filters.isLegendary ? 'true' : undefined,
      minSpeed: this.filters.minSpeed,
      maxSpeed: this.filters.maxSpeed,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
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
    this.updateQueryParams();
  }

  resetFilters() {
    this.filters = {
      limit: 20,
      page: 1,
      sort: '',
      searchName: '',
      type: '',
      isLegendary: false,
      minSpeed: 0,
      maxSpeed: 1000,
    };
    this.updateQueryParams();
    this.searchTerm$.next(this.filters);
  }

  viewPokemonDetails(pokemon: IPokemon): void {
    this.selectedPokemon = pokemon;
    this.showModal = true;
  }

  onCloseModal(): void {
    this.showModal = false;
    this.selectedPokemon = null;
  }

  onPageChange(newPage: number): void {
    this.filters.page = newPage;
    this.updateQueryParams();
    this.searchTerm$.next(this.filters);

  }

  onItemsPerPageChange(newItemsPerPage: number): void {
    this.filters.limit = newItemsPerPage;
    this.filters.page = 1; // Reset to the first page
    this.updateQueryParams();
    this.searchTerm$.next(this.filters);
  }

}

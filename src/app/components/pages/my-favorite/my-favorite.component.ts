import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from "../../partials/pagination/pagination.component";
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../../services/pokemon.service';
import { tap } from 'rxjs';
import { IPokemon } from '../../../models/pokemon.model';
import { PokemonModalComponent } from "../../partials/pokemon-modal/pokemon-modal.component";

@Component({
  selector: 'app-my-favorite',
  standalone: true,
  imports: [PaginationComponent, CommonModule, PokemonModalComponent],
  templateUrl: './my-favorite.component.html',
  styleUrl: './my-favorite.component.scss'
})
export class MyFavoriteComponent implements OnInit {
  pokemons: IPokemon[] = [];
  selectedPokemon: IPokemon | null = null;
  showModal = false;
  
  constructor(private pokemonService: PokemonService) {

  }

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    this.pokemonService.getAllMyFavoritePokemons()
      .pipe(tap((res: any) => {
        this.pokemons = res.data;
      })).subscribe();
  }

  viewPokemonDetails(pokemon: IPokemon): void {
    this.selectedPokemon = pokemon;
    this.showModal = true;
  }

  onCloseModal(): void {
    this.showModal = false;
    this.selectedPokemon = null;
  }
}

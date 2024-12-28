import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPokemon } from '../../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-modal.component.html',
  styleUrl: './pokemon-modal.component.scss'
})
export class PokemonModalComponent {
  @Input() pokemon: IPokemon | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(
    private pokemonService: PokemonService
  ) { }
  
  onClose() {
    this.close.emit();
  }

  toggleFavorite() {
    if (!this.pokemon) {
      return;
    }
    this.pokemon.isFavorite = !this.pokemon.isFavorite;
    this.pokemonService.updateFavoriteToPokemon(this.pokemon._id!, !!this.pokemon.isFavorite).subscribe();
  }
}

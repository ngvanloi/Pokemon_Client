import { Component } from '@angular/core';
import { CarouselComponent } from "../../partials/carousel/carousel.component";
import { PokemonListComponent } from "../../partials/pokemon-list/pokemon-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, PokemonListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}

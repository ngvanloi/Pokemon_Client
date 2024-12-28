import { Component } from '@angular/core';
import { CsvReaderComponent } from "../../partials/csv-reader/csv-reader.component";

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [CsvReaderComponent],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.scss'
})
export class PokemonComponent {

}

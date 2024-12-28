import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { IPokemon } from '../../../models/pokemon.model';
import { IType } from '../../../models/type.model';
import { TypeService } from '../../../services/type.service';
import { catchError, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PokemonService } from '../../../services/pokemon.service';

@Component({
  selector: 'app-csv-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './csv-reader.component.html',
  styleUrl: './csv-reader.component.scss'
})
export class CsvReaderComponent implements OnInit, OnDestroy {
  pokemonObjects: IPokemon[] = [];
  types: IType[] = [];
  newTypes: string[] = [];
  csvHeaders: string[] = [];

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private papa: Papa,
    private typeService: TypeService,
    private pokemonService: PokemonService,
  ) { }

  ngOnInit(): void {
    this.typeService.getAllTypes().pipe(tap((res: any) => this.types = res.data)).subscribe()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];
    if (file.type !== 'text/csv') {
      alert('Please upload a valid CSV file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const csvText = reader.result as string;
      this.parseCSV(csvText);
    };
    reader.readAsText(file);
  }

  parseCSV(csvText: string): void {
    this.papa.parse(csvText, {
      complete: (result) => {
        if (result.data && result.data.length) {
          this.csvHeaders = result.data[0];
          this.convertToObject(result.data.slice(1));
        }
      },
      skipEmptyLines: true,
    });
  }


  convertToObject(pokemonArray: any[][]): void {
    this.pokemonObjects = pokemonArray.map((item) => ({
      id:undefined,
      name: item[1],
      type1: this.findOrCreateType(item[2]),
      type2: item[3] ? this.findOrCreateType(item[3]) : undefined,
      total: parseInt(item[4], 10),
      hp: parseInt(item[5], 10),
      attack: parseInt(item[6], 10),
      defense: parseInt(item[7], 10),
      spAttack: parseInt(item[8], 10),
      spDefense: parseInt(item[9], 10),
      speed: parseInt(item[10], 10),
      generation: parseInt(item[11], 10),
      legendary: item[12] === "true",
      image: item[13],
      ytbUrl: item[14],
    }));
  }

  onSave(): void {
    const typeCreation$ = this.newTypes.length > 0
      ? this.typeService.createManyTypes(this.newTypes).pipe(
        tap((typeResult) => {
          console.log('Types created successfully:', typeResult);
        }),
        catchError((err) => {
          console.error('Error creating types:', err);
          return of(null);
        })
      )
      : of(null);

    typeCreation$
      .pipe(
        switchMap((typeResult) => {
          if (this.pokemonObjects.length > 0) {
            return this.pokemonService.createManyPokemons(this.pokemonObjects).pipe(
              tap((pokemonResult) => {
                console.log('Pokémons created successfully:', pokemonResult);
              }),
              takeUntil(this.unsubscribe$),
            );
          }
          return of(null); 
        })
      )
      .subscribe({
        next: () => {
          console.log('Save operation completed.');
        },
        error: (err) => {
          console.error('Error in save operation:', err);
        },
      });
  }

  findOrCreateType(typeName: string): string {
    let existingType = this.types.find(type => type.name === typeName);

    if (!existingType) {
      if (!this.newTypes.includes(typeName)) {
        this.newTypes.push(typeName);
      }
      return typeName;
    }
    return existingType.name;
  }
}

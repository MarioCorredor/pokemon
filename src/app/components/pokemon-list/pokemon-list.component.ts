import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatAll, finalize, forkJoin } from 'rxjs';
import { APokemon } from 'src/app/models/auxPokemon';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemon-service.service';

@Component({
  selector: 'pokemonList',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent {
  public titulo: string;
  public pokemons!: APokemon;
  public pokemonArray: Pokemon[] = [];
  public isLoading: Boolean;
  public searchText: string = '';
  public filteredPokemons: Pokemon[] = [];
  public selectedType: string = '';

  pokemonTypes: string[] = [
    'Normal',
    'Fire',
    'Water',
    'Grass',
    'Electric',
    'Ice',
    'Fighting',
    'Poison',
    'Ground',
    'Flying',
    'Psychic',
    'Bug',
    'Rock',
    'Ghost',
    'Dark',
    'Dragon',
    'Steel',
    'Fairy',
  ];


  constructor(
    private _pokemonService: PokemonService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.titulo = "Pokemons List";
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.getAllPokemons();
  }

  getAllPokemons() {
    this._pokemonService.getAllPokemons().subscribe(
      data => {
        console.log("Response:", data);
        this.pokemons = {
          count: data.count,
          next: data.next,
          previous: data.previous,
          results: data.results,
        };

        const observables = data.results.map(result =>
          this._pokemonService.getPokemonByUrl(result.url)
        );

        forkJoin(observables).pipe(
          concatAll(),
          finalize(() => {
            this.isLoading = false;
            this.filteredPokemons = this.pokemonArray; // Initialize the filtered list with all pokemons initially
          })
        ).subscribe(
          datos => {
            if (datos && datos.name) {
              this.pokemonArray.push(datos);
            } else {
              console.log("Invalid data:", datos);
            }
          },
          errores => {
            console.log("Error:", errores);
          }
        );
      },
      error => {
        console.error('Error getting pokemons:', error);
      }
    );
  }

  filterPokemons() {
    const searchText = this.searchText.toLowerCase();
    const selectedType = this.selectedType.toLowerCase();
  
    this.filteredPokemons = this.pokemonArray.filter(pokemon => {
      const nameMatches = pokemon.name.toLowerCase().includes(searchText);
      const idMatches = (searchText) && parseInt(searchText) === pokemon.id;
      const typeMatches = !selectedType || pokemon.types.some(type => type.type.name.toLowerCase() === selectedType);
      
      return (nameMatches || idMatches) && typeMatches;
    });
  }
  
  

  redirectToPokemon(pokemonId: number) {
    this._router.navigate([`list/pokemons/${pokemonId}`]);
  }
}

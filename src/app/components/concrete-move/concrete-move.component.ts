import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { concatAll, finalize, forkJoin } from 'rxjs';
import { Move } from 'src/app/models/Move';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemon-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-concrete-move',
  templateUrl: './concrete-move.component.html',
  styleUrls: ['./concrete-move.component.css']
})
export class ConcreteMoveComponent {
  public parametro: any;
  public move!: Move;
  public pokemonArray : Pokemon[] = [];
  public isLoading: Boolean;

  public baseUrl = environment.baseUrl;

  constructor(
    private _pokemonService: PokemonService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { this.isLoading = true; }

  ngOnInit(): void {
    this._route.params.forEach((params: Params) => {
      this.parametro = params["id"];
    });
    if(this.parametro!=null){
      this.getMoveById(this.parametro);
    }
  }

  getMoveById(moveId: string){
    this._pokemonService.getMoveById(moveId).subscribe(
      data => {
        console.log("Move:",data);
        this.move = data;

        const observables = data.learned_by_pokemon.map(result =>
          this._pokemonService.getPokemonByUrl(result.url)
        );
        forkJoin(observables).pipe(
          concatAll(),finalize(() => {
            this.isLoading = false; // Ocultar animación de carga cuando las peticiones se completen
          })
        ).subscribe(
          datos => {
            if (datos && datos.name) {
              this.pokemonArray.push(datos);
            } else {
              console.log("Datos inválidos:", datos);
            }
          },
          errores => {
            console.log("ERRRRRRR:", errores);
          }
        );
      },
      err => {
        console.log(err);
      }
    );
  }

  redirectToPokemon(url: string) {
    const regex = /\/(\d+)\/$/;
    const match = url.match(regex);
    if (match && match.length > 1) {
      const pokemonId = match[1];
      this._router.navigate([`list/pokemons/${pokemonId}`]);
      this._pokemonService.getPokemonById(pokemonId);
    }
  }
  redirectToType(url: string){
    const regex = /\/(\d+)\/$/;
    const match = url.match(regex);
    if (match && match.length > 1) {
      const typeId = match[1];
      this._router.navigate([`types/${typeId}`]);
      this._pokemonService.getTypeById(typeId);
    }
  }

  getEnglishDescription(flavorTextEntries: any[]): string {
    const englishDescription = flavorTextEntries.find(
      (entry: any) => entry.language.name === 'en'
    );
    return englishDescription ? englishDescription.flavor_text : '';
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { concatAll, finalize, forkJoin } from 'rxjs';
import { Move } from 'src/app/models/Move';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonType } from 'src/app/models/type';
import { PokemonService } from 'src/app/services/pokemon-service.service';

@Component({
  selector: 'app-concrete-type',
  templateUrl: './concrete-type.component.html',
  styleUrls: ['./concrete-type.component.css']
})
export class ConcreteTypeComponent {

  public parametro: any;
  public isLoading: boolean;
  public moveArray: Move[] = [];
  public pokemonArray: Pokemon[] = [];
  public type!: PokemonType;

  constructor(
    private _pokemonService: PokemonService,
    private _route: ActivatedRoute,
    private _router: Router,

  ) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    this._route.params.forEach((params: Params) => {
      this.parametro = params["id"];
    });
    if(this.parametro!=null){
      this.getTypeById(this.parametro);
    }
  }

  getTypeById(typeId: string){
    this._pokemonService.getTypeById(typeId).subscribe(
      data => {
        console.log("Type:",data);
        this.type = data;

        const observablesPkmn = data.pokemon.map(result =>
          this._pokemonService.getPokemonByUrl(result.pokemon.url)
        );
        const observablesMvs = data.moves.map(result =>
          this._pokemonService.getMoveByUrl(result.url)
        );
        forkJoin(observablesPkmn).pipe(
          concatAll()
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
        forkJoin(observablesMvs).pipe(
          concatAll()
        ).subscribe(
          datos => {
            if (datos && datos.name) {
              this.moveArray.push(datos);
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
    console.log("MoveArray:",this.moveArray);
    console.log("PokemonArray:",this.pokemonArray);
    this.isLoading = false;
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

  redirectToMove(url: string) {
    const regex = /\/(\d+)\/$/;
    const match = url.match(regex);
    if (match && match.length > 1) {
      const moveId = match[1];
      this._router.navigate([`moves/${moveId}`]);
      this._pokemonService.getMoveById(moveId);
    }
  }

  getEnglishDescription(flavorTextEntries: any[]): string {
    const englishDescription = flavorTextEntries.find(
      (entry: any) => entry.language.name === 'en'
    );
    return englishDescription ? englishDescription.flavor_text : '';
  }

}

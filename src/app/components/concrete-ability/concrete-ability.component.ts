import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { concatAll, finalize, forkJoin } from 'rxjs';
import { Ability } from 'src/app/models/ability';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemon-service.service';

@Component({
  selector: 'app-concrete-ability',
  templateUrl: './concrete-ability.component.html',
  styleUrls: ['./concrete-ability.component.css']
})
export class ConcreteAbilityComponent {
  public parametro: any;
  public isLoading: Boolean;
  public pokemonArray : Pokemon[] = [];
  public ability!: Ability;
  
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
      this.getAbilityById(this.parametro);
    }
  }

  getAbilityById(abilityId: string){
    this._pokemonService.getAbilityById(abilityId).subscribe(
      data => {
        this.ability = data;
        console.log("Ability:",this.ability);

        const observables = data.pokemon.map(result =>
          this._pokemonService.getPokemonByUrl(result.pokemon.url)
        );
        forkJoin(observables).pipe(
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
      },
      err => {
        console.log(err);
      }
    );
    console.log(this.pokemonArray);
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

  getEnglishDescription(flavorTextEntries: any[]): string {
    const englishDescriptions = flavorTextEntries.filter(
      (entry: any) => entry.language.name === 'en'
    );
  
    // Si hay al menos una descripción en inglés, devolvemos la última encontrada
    if (englishDescriptions.length > 0) {
      return englishDescriptions[englishDescriptions.length - 1].flavor_text;
    }
  
    // Si no hay descripciones en inglés, devolvemos una cadena vacía
    return '';
  }
  

}

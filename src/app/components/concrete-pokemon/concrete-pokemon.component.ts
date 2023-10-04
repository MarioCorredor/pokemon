import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { concatAll, finalize, forkJoin } from 'rxjs';
import { Move } from 'src/app/models/Move';
import { AItem } from 'src/app/models/auxItem';
import { ASpecies } from 'src/app/models/auxSpecies';
import { Chain } from 'src/app/models/chain';
import { Item } from 'src/app/models/item';
import { Pokemon } from 'src/app/models/pokemon';
import { Species } from 'src/app/models/species';
import { PokemonService } from 'src/app/services/pokemon-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'concrete-pokemon',
  templateUrl: './concrete-pokemon.component.html',
  styleUrls: ['./concrete-pokemon.component.css']
})
export class ConcretePokemonComponent implements OnInit {

  public parametro: any;
  public pokemon!: Pokemon;
  public pokemonArray: Pokemon[] = [];
  public moveArray: Move[] = [];
  public aSpeciesArray: ASpecies[] = [];
  public speciesArray: Species[] = [];
  public species!: Species;
  public isLoading: Boolean;
  public chain!: Chain;
  public itemArray: Item[] = [];
  public aItem!: AItem;
  public varArray: string[] = [];
  public varPokeArray: Pokemon[] = [];
  public genderArray: string[] = [];

  public baseUrl = environment.baseUrl;

  constructor(
    private _pokemonService: PokemonService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { this.isLoading = true; }

  ngOnInit(): void {
    this.isLoading = true;
    this.aSpeciesArray = [];
    this.speciesArray = [];
    this.varArray = [];
    this.varPokeArray = [];
    this.genderArray = [];
    this._route.params.subscribe(params => {
      const pokemonId = params['id'];
      this.getPokemonById(pokemonId);
      this.getAllItems();
    });
  }

  getPokemonById(pokemonId: string) {
    this._pokemonService.getPokemonById(pokemonId).subscribe(
      data => {
        console.log("Pokemon: ", data);
        this.pokemon = data;

        const observablesMoves = data.moves.map(result =>
          this._pokemonService.getMoveByUrl(result.move.url)
        );

        const observablesSpecies = this._pokemonService.getSpeciesByUrl(data.species.url);

        forkJoin(observablesMoves).pipe(
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

        forkJoin(observablesSpecies).pipe(
          concatAll()
        ).subscribe(
          speciesData => {
            if (speciesData && speciesData.name) {
              this.species = speciesData;
              console.log("Species:", this.species);

              // Obtener la cadena de evolución
              this.getEvolutionChain(this.species.evolution_chain.url);
            } else {
              console.log("Datos inválidos:", speciesData);
            }
          },
          errores => {
            console.log("ERRRRRRR:", errores);
          }
        );
      },
      err => {
        console.log('Error:', err);
      }
    );
  }

  getEvolutionChain(chainUrl: string) {
    this._pokemonService.getChainByUrl(chainUrl).subscribe(
      chainData => {
        if (chainData) {
          this.chain = chainData;
          console.log("Chain", this.chain);
          if (this.chain.chain.evolves_to != null) {
            this.aSpeciesArray.push(this.chain.chain.species);
            for (let i = 0; i < this.chain.chain.evolves_to.length; i++) {
              this.aSpeciesArray.push(this.chain.chain.evolves_to[i].species);
              if (this.chain.chain.evolves_to[i].evolves_to != null) {
                for (let j = 0; j < this.chain.chain.evolves_to[i].evolves_to.length; j++) {
                  this.aSpeciesArray.push(this.chain.chain.evolves_to[i].evolves_to[j].species);
                }
              }
            }
          }
          console.log("aSpeciesArray:", this.aSpeciesArray);

          // Get species data for all species in the chain
          this.getSpecies();
        } else {
          console.log("Datos inválidos:", chainData);
        }
      },
      errores => {
        console.log("ERRRRRRR:", errores);
      }
    );
  }

  getAllItems() {
    this._pokemonService.getAllItems().subscribe(
      (data: AItem) => {
        this.aItem = data;
        const observablesItems = this.aItem.results.map(item =>
          this._pokemonService.getItemByUrl(item.url)
        );

        forkJoin(observablesItems).pipe(
          concatAll()
        ).subscribe(
          itemData => {
            if (itemData && itemData.name) {
              this.itemArray.push(itemData);
            } else {
              console.log("Invalid data:", itemData);
            }
          },
          err => {
            console.log(err);
          }
        );
      },
      err => {
        console.log(err);
      }
    );
  }


  getSpecies() {
    for (let i = 0; i < this.aSpeciesArray.length; i++) {
      this._pokemonService.getSpeciesByUrl(this.aSpeciesArray[i].url).subscribe(
        data => {
          this.speciesArray.push(data);
          this.getPokemons();
        },
        err => {
          console.log(err);
        }
      );
    }
    console.log("speciesArray", this.speciesArray);
    this.getOtherVarieties(this.species.varieties);
  }

  getPokemons() {
    for (let i = 0; i < this.speciesArray.length; i++) {
      const pokemonUrl = this.speciesArray[i].varieties[0].pokemon.url;
      this._pokemonService.getPokemonByUrl(pokemonUrl).subscribe(
        data => {
          // Check if the Pokémon already exists in pokemonArray
          const existingPokemon = this.pokemonArray.find(pokemon => pokemon.id === data.id);

          // If the Pokémon does not exist in the array, add it
          if (!existingPokemon) {
            this.pokemonArray.push(data);

          }
        },
        err => {
          console.log(err);
        }
      );
    }
    console.log("pokemonArray", this.pokemonArray);
  }

  findPokemonInArray(pokename: string) {
    let res: number = 1;
    for (let i = 0; i < this.pokemonArray.length; i++) {
      if (this.pokemonArray[i].name == pokename) {
        res = i;
      }
    }
    return res;
  }

  findImageByName(itemName: string) {
    let res: number = 0;
    const foundItem = this.itemArray.find(item => item.name === itemName);
    if (foundItem) {
      res = foundItem.id - 1;
    }
    return res;
  }

  getEnglishDescription(flavorTextEntries: any[]): string {
    for (let i = 0; i < flavorTextEntries.length; i++) {
      const entry = flavorTextEntries[i];
      if (entry.language.name === 'en') {
        // Utilizamos una expresión regular para eliminar caracteres no alfanuméricos
        return entry.flavor_text.replace(/[^a-zA-Z0-9 ]/g, ' ');
      }
    }
    return '';
  }
  

  getOtherVarieties(varieties: any[]) {
    for (let i = 0; i < varieties.length; i++) {
      if (this.pokemon.name != varieties[i].pokemon.name) {
        this.varArray.push(varieties[i].pokemon.name);
        this._pokemonService.getPokemonByUrl(varieties[i].pokemon.url).subscribe(
          data => { this.varPokeArray.push(data) },
          err => {
            console.log(err);
          }
        )
      }
    }
    console.log("varPokeArray:", this.varPokeArray);
    console.log("varArray:", this.varArray);
    this.isLoading = false;
    return this.varArray;
  }

  getPokemonGenderInfo(genderRate: number){
    switch (genderRate) {
      case -1:
        return null;
      case 0:
        this.genderArray.push("0%");
        this.genderArray.push("100%");
        return null;
      case 1:
        this.genderArray.push("12.5%");
        this.genderArray.push("87.5%");
        return null; 
      case 2:
        this.genderArray.push("25%");
        this.genderArray.push("75%");
        return null; 
      case 3:
        this.genderArray.push("37.5%");
        this.genderArray.push("62.5%");
        return null; 
      case 4:
        this.genderArray.push("50%");
        this.genderArray.push("50%");
        return null; 
      case 5:
        this.genderArray.push("62.5%");
        this.genderArray.push("37.5%");
        return null; 
      case 6:
        this.genderArray.push("75%");
        this.genderArray.push("25%");
        return null; 
      case 7:
        this.genderArray.push("87.5%");
        this.genderArray.push("12.5%");
        return null; 
      case 8:
        this.genderArray.push("100%");
        this.genderArray.push("0%");
        return null; 
      default:
        return null;
    }
  }

  redirectToNext(){
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([`list/pokemons/${this.pokemon.id + 1}`]);
    });
  }
  redirectToPrevious(){
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([`list/pokemons/${this.pokemon.id - 1}`]);
    });
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

  redirectToItem(url: string) {
    const regex = /\/(\d+)\/$/;
    const match = url.match(regex);
    if (match && match.length > 1) {
      const itemId = match[1];
      this._router.navigate([`items/${itemId}`]);
      this._pokemonService.getItemById(itemId);
    }
  }

  redirectToAbility(url: string) {
    const regex = /\/(\d+)\/$/;
    const match = url.match(regex);
    if (match && match.length > 1) {
      const abilityId = match[1];
      this._router.navigate([`abilities/${abilityId}`]);
      this._pokemonService.getAbilityById(abilityId);
    }
  }

  redirectToType(url: string) {
    const regex = /\/(\d+)\/$/;
    const match = url.match(regex);
    if (match && match.length > 1) {
      const typeId = match[1];
      this._router.navigate([`types/${typeId}`]);
      this._pokemonService.getTypeById(typeId);
    }
  }

  redirectToPokemon(pokemonId: number) {
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([`list/pokemons/${pokemonId}`]);
    });
  }
}

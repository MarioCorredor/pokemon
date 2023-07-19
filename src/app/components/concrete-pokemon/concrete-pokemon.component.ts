import { Component, OnInit } from '@angular/core';
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
    if (this.parametro != null) {
      this.getPokemonById(this.parametro);
      this.getAllItems();
    }
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
          concatAll(),
          finalize(() => {
            this.isLoading = false;
          })
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
          concatAll(),
          finalize(() => {
            this.isLoading = false;
          })
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
          concatAll(),
          finalize(() => {
            this.isLoading = false;
          })
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
          console.log("speciesArray", this.speciesArray);
          this.getPokemons();
        },
        err => {
          console.log(err);
        }
      );
    }

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
            console.log("pokemonArray", this.pokemonArray);
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  findPokemonInArray(pokename: string){
    let res: number = 0;
    for(let i=0; i<this.pokemonArray.length;i++){
      if(this.pokemonArray[i].name == pokename){
        res = i;
      }
    }
    return res;
  }

  findImageByName(itemName: string){
    let res: number = 0;
    const foundItem = this.itemArray.find(item => item.name === itemName);
    if(foundItem){
      res = foundItem.id - 1;
    }
    return res;
  }

  redirectplus() {
    this._router.navigate(["list/pokemons/" + (this.pokemon.id + 1)]);
    this.getPokemonById(String(this.pokemon.id + 1));
  }

  redirectminus() {
    this._router.navigate(["list/pokemons/" + (this.pokemon.id - 1)]);
    this.getPokemonById(String(this.pokemon.id - 1));
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

  redirectToType(url: string) {
    const regex = /\/(\d+)\/$/;
    const match = url.match(regex);
    if (match && match.length > 1) {
      const typeId = match[1];
      this._router.navigate([`types/${typeId}`]);
      this._pokemonService.getTypeById(typeId);
    }
  }
}

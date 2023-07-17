import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { concatAll, finalize, forkJoin } from 'rxjs';
import { Move } from 'src/app/models/Move';
import { Chain } from 'src/app/models/chain';
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
  public moveArray: Move[] = [];
  public speciesArray: Species[] = [];
  public species!: Species;
  public isLoading: Boolean;
  public chain!: Chain;

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

          // Llamada recursiva para obtener todas las especies anidadas en la cadena
          this.getAllNestedSpecies(this.chain);
        } else {
          console.log("Datos inválidos:", chainData);
        }
      },
      errores => {
        console.log("ERRRRRRR:", errores);
      }
    );
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

  getAllNestedSpecies(chain: Chain) {
    if (chain) {
      this._pokemonService.getSpeciesByUrl(chain.chain.species.url).subscribe(
        speciesData => {
          if (speciesData && speciesData.name) {
            console.log("Nested Species:", speciesData);
  
            // Guardar la especie anidada si es necesario
            this.speciesArray.push(speciesData);
  
            // Obtener la URL de la imagen del Pokémon y actualizar la propiedad 'imageUrl'
            // this.getPokemonImage(speciesData).subscribe(
            //   imageUrl => {
            //     speciesData.imageUrl = imageUrl;
            //   },
            //   error => {
            //     // Si ocurre un error al obtener la imagen, puedes establecer una URL de imagen de reemplazo o dejarla como 'undefined'.
            //     speciesData.imageUrl = 'URL_DE_REEMPLAZO_O_UNDEFINED';
            //   }
            // );
  
            // Llamada recursiva para seguir obteniendo especies anidadas
            if (chain.chain.evolves_to && chain.chain.evolves_to.length > 0) {
              for (const evolvesToChain of chain.chain.evolves_to) {
                this.getAllNestedSpecies(evolvesToChain);
              }
            }
          } else {
            console.log("Datos inválidos:", speciesData);
          }
        },
        errores => {
          console.log("ERRRRRRR:", errores);
        }
      );
    }
  }
  
}

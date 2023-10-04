import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { concatAll, forkJoin } from 'rxjs';
import { AChain } from 'src/app/models/auxChain';
import { Chain } from 'src/app/models/chain';
import { Item } from 'src/app/models/item';
import { Pokemon } from 'src/app/models/pokemon';
import { Species } from 'src/app/models/species';
import { PokemonService } from 'src/app/services/pokemon-service.service';

@Component({
  selector: 'app-concrete-item',
  templateUrl: './concrete-item.component.html',
  styleUrls: ['./concrete-item.component.css']
})
export class ConcreteItemComponent {
  public parametro: any;
  public item!: Item;
  public pokemonArray: Pokemon[] = [];
  public aChain!: AChain;
  public chainArray: Chain[] = [];
  public urlsArray: string[] = [];
  public speciesArray: Species[] = [];
  public isLoading: Boolean;

  constructor(
    private _pokemonService: PokemonService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { this.isLoading = true; }

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      this.parametro = params["id"];
    });
    if (this.parametro != null) {
      this.getItemById(this.parametro);
    }
  }

  getItemById(itemId: string) {
    this._pokemonService.getItemById(itemId).subscribe(
      data => {
        console.log("Item:", data);
        this.item = data;
        this.getAllChains();
      },
      err => {
        console.log("Error:", err);
      }
    );
    this.isLoading = false;
  }

  getAllChains() {
    this._pokemonService.getAllChains().subscribe(
      data => {
        console.log("Chains:", data);
        this.aChain = data;
        const observables = data.results.map(result =>
          this._pokemonService.getChainByUrl(result.url)
        );

        forkJoin(observables).pipe(
          concatAll()
        ).subscribe(
          datos => {
            if (datos) {
              this.chainArray.push(datos);
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
        console.log("Error:", err);
      }
    );
    console.log("chainArray:", this.chainArray);
    console.log(this.chainArray.length);
    for (let i = 0; i < this.chainArray.length; i++) {
      console.log("for1:",i);
      this.extractSpeciesUrls(this.chainArray[i]);
    }

    for(let i = 0; i < this.urlsArray.length; i++){
      this.getSpeciesByUrl(this.urlsArray[i]);
    }
  }

  extractSpeciesUrls(data: any) {
    if (data !== null && typeof data === 'object') {
      if ('species' in data && data['species'] && data['species']['url']) {
        this.urlsArray.push(data['species']['url']);
      }

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this.extractSpeciesUrls(data[key]);
        }
      }
    }
    console.log(this.urlsArray);
  }

  getSpeciesByUrl(speciesUrl: string){
    this._pokemonService.getSpeciesByUrl(speciesUrl).subscribe(
      data => {
        this.speciesArray.push(data);
      },
      err => {
        console.log(err);
      }
    );
    console.log("speciesArray:", this.speciesArray);
  }

}

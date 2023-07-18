import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Item } from 'src/app/models/item';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemon-service.service';

@Component({
  selector: 'app-concrete-item',
  templateUrl: './concrete-item.component.html',
  styleUrls: ['./concrete-item.component.css']
})
export class ConcreteItemComponent {
  public parametro: any;
  public item!: Item;
  public pokemonArray : Pokemon[] = [];
  public isLoading: Boolean;

  constructor(
    private _pokemonService: PokemonService,
    private _route: ActivatedRoute,
    private _router: Router
  ){this.isLoading = true; }

  ngOnInit(){
    this._route.params.forEach((params: Params) => {
      this.parametro = params["id"];
    });
    if(this.parametro!=null){
      this.getItemById(this.parametro);
    }
  }

  getItemById(itemId: string){
    this._pokemonService.getItemById(itemId).subscribe(
      data =>{
        console.log("Item:",data);
        this.item = data;
      },
      err => {
        console.log("Error:",err);
      }
    );
  }
}

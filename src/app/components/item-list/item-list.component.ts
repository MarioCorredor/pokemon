import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatAll, finalize, forkJoin } from 'rxjs';
import { AItem } from 'src/app/models/auxItem';
import { Item } from 'src/app/models/item';
import { PokemonService } from 'src/app/services/pokemon-service.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent {

  public titulo: string;
  public isLoading: Boolean;
  public items!: AItem;
  public itemArray: Item[] = [];
  public searchText: string = '';
  public filteredItems: Item[] = [];

  constructor(
    private _pokemonService: PokemonService,
    private _route: ActivatedRoute,
    private _router: Router,
  ){
    this.titulo = "Items List";
    this.isLoading = true;
  }

  ngOnInit(){
    this.getAllItems();
  }

  getAllItems(){
    this._pokemonService.getAllItems().subscribe(
      data => {
        console.log("Items:",data);
        this.items = data;

        const observables = data.results.map(result =>
          this._pokemonService.getItemByUrl(result.url)
        );

        forkJoin(observables).pipe(
          concatAll(),
          finalize(() => {
            this.isLoading = false;
            this.filterItems(); // Apply filters after loading items
          })
        ).subscribe(
          datos => {
            if (datos && datos.name) {
              this.itemArray.push(datos);
            } else {
              console.log("Invalid data:", datos);
            }
          },
          errores => {
            console.log("Error:", errores);
          }
        );

      },
      err =>{
        console.log("Error:",err);
      }
    );
  }

  filterItems() {
    this.filteredItems = this.itemArray.filter((item) => {
      // Filter by name
      const nameMatches = item.name.toLowerCase().includes(this.searchText.toLowerCase());

      return nameMatches;
    });
  }

  redirectToItem(itemId: number){
    this._router.navigate(['items/' + itemId]);
  }

}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatAll, finalize, forkJoin } from 'rxjs';
import { Move } from 'src/app/models/Move';
import { AMove } from 'src/app/models/auxMove';
import { PokemonService } from 'src/app/services/pokemon-service.service';

@Component({
  selector: 'app-moves-list',
  templateUrl: './moves-list.component.html',
  styleUrls: ['./moves-list.component.css']
})
export class MovesListComponent {
  public titulo: string;
  public moves!: AMove;
  public moveArray: Move[] = [];
  public isLoading: Boolean;
  public filteredMoveArray: Move[] = [];
  public searchText: string = '';
  public selectedType: string = "";
  public selectedCategory: string = "";
  public sortBy: string = "";

  public types: string[] = ["Normal", "Fire", "Water", "Grass", "Electric", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Ice", "Dragon", "Dark", "Steel", "Fairy"];
  public categories: string[] = ["Physical", "Special", "Status"];


  constructor(
    private _pokemonService: PokemonService,
    private _route: ActivatedRoute,
    private _router: Router,

  ) {
    this.titulo = "Moves List";
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.getAllMoves();
  }

  getAllMoves() {
    this._pokemonService.getAllMoves().subscribe(
      data => {
        console.log("Response:", data);
        this.moves = data;
        const observables = data.results.map(result =>
          this._pokemonService.getMoveByUrl(result.url)
        );

        forkJoin(observables).pipe(
          concatAll(),
          finalize(() => {
            this.isLoading = false; // Ocultar animación de carga cuando las peticiones se completen
            this.filteredMoveArray = [...this.moveArray]; // Initialize filteredMoveArray with all moves
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
      },
      error => {
        console.error('Error getting moves:', error);
      }
    );
  }


  redirectToMove(moveId: string) {
    this._router.navigate([`moves/${moveId}`]);
    this._pokemonService.getMoveById(moveId);

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

  getEnglishDescription(flavorTextEntries: any[]): string {
    const englishDescription = flavorTextEntries.find(
      (entry: any) => entry.language.name === 'en'
    );
    return englishDescription ? englishDescription.flavor_text : '';
  }

  filterMoves() {
    this.filteredMoveArray = this.moveArray.filter((move) => {
      const nameMatch = move.name.toLowerCase().includes(this.searchText.toLowerCase());
      const typeMatch = this.selectedType === '' || move.type.name === this.selectedType;
      const categoryMatch = this.selectedCategory === '' || move.damage_class.name === this.selectedCategory;
      return nameMatch && typeMatch && categoryMatch;
    });

    this.sortMoves();
  }

  sortMoves() {
    if (this.sortBy === 'id') {
      this.filteredMoveArray.sort((a, b) => a.id.localeCompare(b.id));
    } else if (this.sortBy === 'name') {
      this.filteredMoveArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'type') {
      this.filteredMoveArray.sort((a, b) => a.type.name.localeCompare(b.type.name));
    } else if (this.sortBy === 'category') { 
      this.filteredMoveArray.sort((a, b) => a.damage_class.name.localeCompare(b.damage_class.name));
    }
  }

}

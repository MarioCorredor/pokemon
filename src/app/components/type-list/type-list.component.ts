import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Move } from 'src/app/models/Move';
import { AType } from 'src/app/models/auxType';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemon-service.service';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.css']
})
export class TypeListComponent {
  public isLoading: Boolean;
  public types!: AType;

  constructor(
    private _pokemonService: PokemonService,
    private _router: Router,

  ) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.getAllTypes();
  }

  getAllTypes() {
    this._pokemonService.getAllTypes().subscribe(
      data => {
        console.log("Types:", data);
        this.types = data;
        this.isLoading = false;
      },
      err => {
        console.log(err);
      }
    );
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { concatAll, finalize, forkJoin } from 'rxjs';
import { Ability } from 'src/app/models/ability';
import { AAbility } from 'src/app/models/auxAbility';
import { PokemonService } from 'src/app/services/pokemon-service.service';

@Component({
  selector: 'app-ability-list',
  templateUrl: './ability-list.component.html',
  styleUrls: ['./ability-list.component.css']
})
export class AbilityListComponent implements OnInit {

  public isLoading: boolean;
  public abilities!: AAbility;
  public titulo: string;
  public abilityArray: Ability[] = [];
  public searchText: string = '';
  public filteredAbilities: Ability[] = [];

  constructor(
    private _pokemonService: PokemonService,
    private _router: Router,
  ) { 
    this.isLoading = true;
    this.titulo = "Abilities List";
  }

  ngOnInit() {
    this.getAllAbilities();
  }

  getAllAbilities(){
    this._pokemonService.getAllAbilities().subscribe(
      data => {
        this.abilities = data;
        console.log(this.abilities);
        this.isLoading = false;

        const observables = data.results.map(result =>
          this._pokemonService.getAbilityByUrl(result.url)
        );

        forkJoin(observables).pipe(
          concatAll(),
          finalize(() => {
            this.isLoading = false;
            this.filteredAbilities = this.abilityArray; // Initialize the filtered list with all pokemons initially
          })
        ).subscribe(
          datos => {
            if (datos && datos.name) {
              this.abilityArray.push(datos);
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
    )
    console.log(this.abilityArray);
    
  }

  filterAbilities() {
    const searchText = this.searchText.toLowerCase();
    this.filteredAbilities = this.abilityArray.filter(ability => {
      const nameMatches = ability.name.toLowerCase().includes(searchText);
      return nameMatches;
    });
  }

  getAbilityEffect(effectEntries: any[]): string {
    for (let entry of effectEntries) {
      if (entry.language.name === 'en') {
        return entry.short_effect;
      }
    }
    return '';
  }

  redirectToAbility(abilityId: number){
    this._router.navigate([`abilities/${abilityId}`]);
  }
}

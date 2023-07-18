import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Pokemon } from '../models/pokemon';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment.development';
import { APokemon } from '../models/auxPokemon';
import { AMove } from '../models/auxMove';
import { Move } from '../models/Move';
import { AType } from '../models/auxType';
import { PokemonType } from '../models/type';
import { Species } from '../models/species';
import { Chain } from '../models/chain';
import { AItem } from '../models/auxItem';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  public baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
    console.log("BASE URL", this.baseUrl);
  }

  getPokemonById(pokemonId: string): Observable<Pokemon> {
    const url = this.baseUrl + "pokemon/" + pokemonId;
    console.log('PETICION:', url);
    return this._http.get<Pokemon>(url);
  }

  getAllPokemons(): Observable<APokemon>{
    const url = this.baseUrl + "pokemon?limit=100000&offset=0";
    return this._http.get<APokemon>(url);
  }

  getPokemonByUrl(url: string): Observable<Pokemon>{
    return this._http.get<Pokemon>(url);
  }

  getAllMoves(): Observable<AMove>{
    const url = "https://pokeapi.co/api/v2/move?limit=900&offset=0";
    return this._http.get<AMove>(url);
  }

  getMoveById(moveId: string): Observable<Move> {
    const url = this.baseUrl + "move/" + moveId;
    console.log('PETICION:', url);
    return this._http.get<Move>(url);
  }

  getMoveByUrl(url: string): Observable<Move>{
    return this._http.get<Move>(url);
  }

  getAllTypes(): Observable<AType>{
    const url = "https://pokeapi.co/api/v2/type?limit=18&offset=0";
    return this._http.get<AType>(url);
  }

  getTypeById(typeId: string): Observable<PokemonType> {
    const url = this.baseUrl + "type/" + typeId;
    console.log('PETICION:', url);
    return this._http.get<PokemonType>(url);
  }

  getTypeByUrl(url: string): Observable<PokemonType>{
    return this._http.get<PokemonType>(url);
  }

  getSpeciesByUrl(url: string): Observable<Species>{
    return this._http.get<Species>(url);
  }
  
  getChainByUrl(url: string): Observable<Chain>{
    return this._http.get<Chain>(url);
  }

  // getPokemonImageUrl(pokemonId: number): Observable<string> {
  //   // Supongamos que la API proporciona la URL de la imagen en el campo 'image_url'
  //   return this._http.get<Pokemon>(`${this.baseUrl}pokemon/${pokemonId}`).pipe(
  //     map((pokemon: Pokemon) => pokemon.image_url)
  //   );

  getAllItems(): Observable<AItem>{
    const url = this.baseUrl + "item?limit=100000&offset=0";
    return this._http.get<AItem>(url);
  }

  getItemByUrl(url: string): Observable<Item>{
    return this._http.get<Item>(url);
  }

  getItemById(itemId: string): Observable<Item>{
    const url = this.baseUrl + "item/" + itemId;
    return this._http.get<Item>(url);
  }

}

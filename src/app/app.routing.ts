import { ModuleWithProviders, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PokemonListComponent } from "./components/pokemon-list/pokemon-list.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { ConcretePokemonComponent } from "./components/concrete-pokemon/concrete-pokemon.component";
import { MovesListComponent } from "./components/moves-list/moves-list.component";
import { ConcreteMoveComponent } from "./components/concrete-move/concrete-move.component";
import { ConcreteTypeComponent } from "./components/concrete-type/concrete-type.component";
import { TypeListComponent } from "./components/type-list/type-list.component";

const appRoutes: Routes = [
    {path: '', component: PokemonListComponent},
    {path: 'list', component: PokemonListComponent},
    {path: 'list/pokemons/:id', component: ConcretePokemonComponent},
    {path: 'moves', component: MovesListComponent},
    {path: 'moves/:id', component: ConcreteMoveComponent},
    {path: 'types', component: TypeListComponent},
    {path: 'types/:id', component: ConcreteTypeComponent},
    {path: '**', component: NotFoundComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<NgModule> = RouterModule.forRoot(appRoutes);
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './app.routing';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonInventoryComponent } from './components/pokemon-inventory/pokemon-inventory.component';
import { NavComponent } from './components/nav/nav.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { ConcretePokemonComponent } from './components/concrete-pokemon/concrete-pokemon.component';
import { MovesListComponent } from './components/moves-list/moves-list.component';
import { ConcreteMoveComponent } from './components/concrete-move/concrete-move.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ConcreteTypeComponent } from './components/concrete-type/concrete-type.component';
import { TypeListComponent } from './components/type-list/type-list.component';
import { FormsModule } from '@angular/forms';
import { AbilityListComponent } from './components/ability-list/ability-list.component';
import { ConcreteAbilityComponent } from './components/concrete-ability/concrete-ability.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ConcreteItemComponent } from './components/concrete-item/concrete-item.component';
import { LoaderComponent } from './components/loader/loader.component';




@NgModule({
  declarations: [
    AppComponent,
    PokemonListComponent,
    PokemonInventoryComponent,
    NavComponent,
    NotFoundComponent,
    ConcretePokemonComponent,
    MovesListComponent,
    ConcreteMoveComponent,
    ConcreteTypeComponent,
    TypeListComponent,
    AbilityListComponent,
    ConcreteAbilityComponent,
    ItemListComponent,
    ConcreteItemComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FormsModule
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

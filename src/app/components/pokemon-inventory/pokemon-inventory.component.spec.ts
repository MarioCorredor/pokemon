import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonInventoryComponent } from './pokemon-inventory.component';

describe('PokemonInventoryComponent', () => {
  let component: PokemonInventoryComponent;
  let fixture: ComponentFixture<PokemonInventoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PokemonInventoryComponent]
    });
    fixture = TestBed.createComponent(PokemonInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

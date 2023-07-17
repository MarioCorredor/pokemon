import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcretePokemonComponent } from './concrete-pokemon.component';

describe('ConcretePokemonComponent', () => {
  let component: ConcretePokemonComponent;
  let fixture: ComponentFixture<ConcretePokemonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConcretePokemonComponent]
    });
    fixture = TestBed.createComponent(ConcretePokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

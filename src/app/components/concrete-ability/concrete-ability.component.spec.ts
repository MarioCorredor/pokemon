import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcreteAbilityComponent } from './concrete-ability.component';

describe('ConcreteAbilityComponent', () => {
  let component: ConcreteAbilityComponent;
  let fixture: ComponentFixture<ConcreteAbilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConcreteAbilityComponent]
    });
    fixture = TestBed.createComponent(ConcreteAbilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

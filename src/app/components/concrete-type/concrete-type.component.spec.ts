import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcreteTypeComponent } from './concrete-type.component';

describe('ConcreteTypeComponent', () => {
  let component: ConcreteTypeComponent;
  let fixture: ComponentFixture<ConcreteTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConcreteTypeComponent]
    });
    fixture = TestBed.createComponent(ConcreteTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

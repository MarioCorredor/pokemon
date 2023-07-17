import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcreteMoveComponent } from './concrete-move.component';

describe('ConcreteMoveComponent', () => {
  let component: ConcreteMoveComponent;
  let fixture: ComponentFixture<ConcreteMoveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConcreteMoveComponent]
    });
    fixture = TestBed.createComponent(ConcreteMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

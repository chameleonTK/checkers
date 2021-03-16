import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardStatComponentComponent } from './board-stat-component.component';

describe('BoardStatComponentComponent', () => {
  let component: BoardStatComponentComponent;
  let fixture: ComponentFixture<BoardStatComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardStatComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardStatComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

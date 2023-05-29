import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeGeocachingRankingComponent } from './juego-de-geocaching-ranking.component';

describe('JuegoDeGeocachingRankingComponent', () => {
  let component: JuegoDeGeocachingRankingComponent;
  let fixture: ComponentFixture<JuegoDeGeocachingRankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeGeocachingRankingComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeGeocachingRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

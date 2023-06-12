import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderPreguntaJuegoGeocachingComponent } from './responder-pregunta-juego-geocaching.component';

describe('ResponderPreguntaJuegoGeocachingComponent', () => {
  let component: ResponderPreguntaJuegoGeocachingComponent;
  let fixture: ComponentFixture<ResponderPreguntaJuegoGeocachingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponderPreguntaJuegoGeocachingComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponderPreguntaJuegoGeocachingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

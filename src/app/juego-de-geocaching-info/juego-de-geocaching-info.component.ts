import { Component, OnInit, ViewChild } from '@angular/core';
import { SesionService, PeticionesAPIService } from '../servicios';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { Juego, AlumnoJuegoDeGeocaching, Escenario, PuntoGeolocalizable, Pregunta } from '../clases';

import { CalculosService } from '../servicios/calculos.service';
import { MatHorizontalStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-juego-de-geocaching-info',
  templateUrl: './juego-de-geocaching-info.component.html',
  styleUrls: ['./juego-de-geocaching-info.component.scss'],
})
export class JuegoDeGeocachingInfoComponent implements OnInit {

  alumnoId: number;
  alumnoJuegoDeGeocaching: AlumnoJuegoDeGeocaching;
  juegoSeleccionado: Juego;
  escenario: Escenario;
  descripcion: string = '';
  puntuacionCorrecta: number;
  puntuacionIncorrecta: number;
  puntuacionCorrectaBonus: number;
  puntuacionIncorrectaBonus: number;
  preguntasBasicas: Pregunta[];
  idpreguntasBasicas: number[];
  preguntasBonus: Pregunta[];
  idpreguntasBonus: number[];
  puntogeolocalizable: PuntoGeolocalizable;
  puntosgeolocalizables: PuntoGeolocalizable[];
  preguntabasica: Pregunta;
  preguntabonus: Pregunta;

  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
    private alertCtrl: AlertController,
    private platform: Platform
    // private servidor: Socket
  ) { }

  ngOnInit() {
    this.alumnoId = this.sesion.DameAlumno().id;
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.puntuacionCorrecta = this.juegoSeleccionado.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.juegoSeleccionado.PuntuacionIncorrecta;
    this.puntuacionCorrectaBonus = this.juegoSeleccionado.PuntuacionCorrectaBonus;
    this.puntuacionIncorrectaBonus = this.juegoSeleccionado.PuntuacionIncorrectaBonus;
    this.idpreguntasBasicas = this.juegoSeleccionado.PreguntasBasicas;
    this.idpreguntasBonus = this.juegoSeleccionado.PreguntasBonus;

  }
  @ViewChild(MatHorizontalStepper, {static: false}) stepper: MatHorizontalStepper;
  step1Completed = false;

  isLinear = true;

  back() {
    this.stepper.previous();
  }

  next() {
    this.stepper.next();
  }

}

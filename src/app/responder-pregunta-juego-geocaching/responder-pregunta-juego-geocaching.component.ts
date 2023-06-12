import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlertController, IonicModule, NavController, Platform, PopoverController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MiAlumnoAMostrarJuegoDeGeocaching } from '../clases/MiAlumnoAMostrarJuegoDeGeocaching';
import { Pregunta } from '../clases/Pregunta';
import { PuntoGeolocalizable } from '../clases/PuntoGeolocalizable';
import { AlumnoJuegoDeGeocaching, Juego, Escenario } from '../clases';
import { Router } from '@angular/router';
import { SesionService, PeticionesAPIService, CalculosService } from '../servicios';


@Component({
  selector: 'app-responder-pregunta-juego-geocaching',
  templateUrl: './responder-pregunta-juego-geocaching.component.html',
  styleUrls: ['./responder-pregunta-juego-geocaching.component.scss'],
})


export class ResponderPreguntaJuegoGeocachingComponent implements OnInit {
  
  empezado: boolean = false;
  rendirse: boolean = false;
  alertaproximidad: boolean = false;
  ubicacion: boolean = false;
  respuesta: boolean = false;
  bonus: boolean = false;
  respuestabonus: boolean = false;
  opcionSeleccionada: string = '';
  seleccionRealizada: boolean = false;

  
  mostrarPregunta: boolean = false;

  vof: boolean;
  controlPreguntas: boolean = false;
  
  @Output() triggerNextPunto = new EventEmitter<void>();
  @Output() sumatorioPuntos = new EventEmitter<number>();
  @Output() puntosActuales : number;

  @Input() alumnoId: number;
  @Input() alumnoJuegoDeGeocaching: AlumnoJuegoDeGeocaching;
  @Input() juegoSeleccionado: Juego;
  @Input() escenario: Escenario;
  @Input() descripcion: string = '';
  @Input() puntuacionCorrecta: number;
  @Input() puntuacionIncorrecta: number;
  @Input() puntuacionCorrectaBonus: number;
  @Input() puntuacionIncorrectaBonus: number;
  @Input() preguntasBasicas: Pregunta[];
  @Input() idpreguntasBasicas: number[];
  @Input() preguntasBonus: Pregunta[];
  @Input() idpreguntasBonus: number[];
  @Input() puntogeolocalizable: PuntoGeolocalizable;
  @Input() puntosgeolocalizables: PuntoGeolocalizable[];
  @Input() preguntabasica: Pregunta;
  @Input() preguntabonus: Pregunta;

  @Input() MisAlumnosDelJuegoDeGeocaching: MiAlumnoAMostrarJuegoDeGeocaching[];
  
  

  @Input() puntuaciontotal: number;
  @Input() numeroEtapas: number;
  @Input() index: number
  distancia: number = 1000;
  @Input() identificador: any;

  distanciaNueva: number;


  @Input() coords: any

  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  @Input() respuestasPosiblesBasicas: string[] = [];
  @Input() respuestasPosiblesBonus: string[] = [];
  RespuestaEscogidaBasica: string;
  RespuestaEscogidaBonus: string;
  Nota: number
  @Input() PuntuacionInicial: string = '';
 
 
  //definimos la posición de la respuesta correcta en cada pregunta basica y bonus

  @Input() ordenRespuestaCorrectaBasicas: number[] 
  @Input() ordenRespuestaCorrectaBonus: number[] 
 


  

  constructor(

    private sesion: SesionService,
    public navCtrl: NavController,
    private route: Router,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
    private alertCtrl: AlertController,
    private platform: Platform,
    private cd: ChangeDetectorRef,
    private popCtrl: PopoverController
  ) {}

  async ngOnInit() {
    
    this.preparacionpreguntas();
    


    
   
     
    
     

     
  }


  preparacionpreguntas(){

    if (this.respuestasPosiblesBasicas.length === 0) {
  
      this.respuestasPosiblesBasicas.push(this.preguntasBasicas[this.index].RespuestaIncorrecta1);
      this.respuestasPosiblesBasicas.push(this.preguntasBasicas[this.index].RespuestaIncorrecta2);
      this.respuestasPosiblesBasicas.push(this.preguntasBasicas[this.index].RespuestaIncorrecta3);
      this.respuestasPosiblesBasicas.splice(this.ordenRespuestaCorrectaBasicas[this.index], 0, this.preguntasBasicas[this.index].RespuestaCorrecta);
      console.log(this.respuestasPosiblesBasicas);
  
      this.respuestasPosiblesBonus.push(this.preguntasBonus[this.index].RespuestaIncorrecta1);
      this.respuestasPosiblesBonus.push(this.preguntasBonus[this.index].RespuestaIncorrecta2);
      this.respuestasPosiblesBonus.push(this.preguntasBonus[this.index].RespuestaIncorrecta3);
      this.respuestasPosiblesBonus.splice(this.ordenRespuestaCorrectaBonus[this.index], 0, this.preguntasBonus[this.index].RespuestaCorrecta);
  }
  
  }



respuestaVerdaderoFalsoBasica(vof: boolean){
  if(vof == true){
    this.RespuestaEscogidaBasica = 'verdadero';
    this.PreguntaBasica();
  }else if (vof == false){
    this.RespuestaEscogidaBasica = 'falso';
    this.PreguntaBasica();
  
  }


}

respuestaVerdaderoFalsoBonus(vof: boolean){
  if(vof == true){
    this.RespuestaEscogidaBonus = 'verdadero';
    this.PreguntaBonus();
  }else if (vof == false){
    this.RespuestaEscogidaBonus = 'falso';
    this.PreguntaBonus();
  
  }


}



confirmarOpcionBasica(){
    if(this.opcionSeleccionada != ''){
    this.RespuestaEscogidaBasica = this.opcionSeleccionada;
    this.PreguntaBasica();
    }else{
      const alert = this.alertCtrl.create({
        header: 'Cuidado',
        message: 'Debes seleccionar una opción',
        buttons: ['OK']
       
       });
    }
  
}

confirmarOpcionBonus(){
  if(this.opcionSeleccionada != ''){
    this.RespuestaEscogidaBonus = this.opcionSeleccionada;
    this.PreguntaBonus();
  }else{
    const alert = this.alertCtrl.create({
      header: 'Cuidado',
      message: 'Debes seleccionar una opción',
      buttons: ['OK']
     
     });

  }
}


 


PreguntaBasica(){
    if (this.RespuestaEscogidaBasica === this.preguntabasica.RespuestaCorrecta) {
      console.log('paso por preguntabasica y la acierto');
      this.respuesta = true;
      this.RespuestaCorrecta();
    }
    if (this.RespuestaEscogidaBasica !== this.preguntabasica.RespuestaCorrecta) {
      console.log('paso por pregunta basica y la fallo');
      this.respuesta = false;
      this.bonus = false;
      console.log('respuesta' + this.respuesta);
      console.log('bonus' + this.bonus);
      this.RespuestaIncorrecta();
    }
}
PreguntaBonus(){
  if (this.RespuestaEscogidaBonus === this.preguntabonus.RespuestaCorrecta) {
    console.log('paso por bonus y la acierto');
    this.respuestabonus = true;
    this.RespuestaCorrectaBonus();
  }
  else {
    console.log('paso por bonus y la fallo')
    this.respuestabonus = false;
    this.RespuestaIncorrectaBonus();
  }
}

Puntuacion(){
  if (this.respuesta === false) {
    //ha fallado la pregunta
    this.Nota = this.puntuacionIncorrecta*(-1);
  }
  if (this.respuesta === true) {
    //acierta pregunta
    this.Nota = this.puntuacionCorrecta;
    if (this.rendirse === true) {
      //se ha rendido
      this.Nota = 0.8*this.Nota;
    }
    if (this.bonus === true){
      //si realiza el bonus:
      if (this.respuestabonus === true){
        //acierta pregunta bonus
        this.Nota = this.Nota + (this.Nota*this.puntuacionCorrectaBonus*0.01);
      }
      if (this.respuestabonus === false) {
        //falla pregunta bonus
        this.Nota = this.Nota - (this.Nota*this.puntuacionIncorrectaBonus*0.01);
      }
    }
  }
  console.log("esta es la puntuacion total hasta ahora:" + this.puntuaciontotal);
  console.log("esta es la puntuacion de este bloque de preguntas:" + this.Nota);
  this.puntuaciontotal = this.puntuaciontotal + this.Nota;
  console.log("esta es la puntuacion total despues de sumar:" + this.puntuaciontotal);
  this.calculos.puntosGeocaching = this.puntuaciontotal;
 

  

   this.peticionesAPI.PonerNotaAlumnoJuegoDeGeocaching(new AlumnoJuegoDeGeocaching (this.alumnoId, this.juegoSeleccionado.id,this.puntuaciontotal, this.index+1), this.alumnoJuegoDeGeocaching[0].id)
     .subscribe(res => {
       console.log(res);
     });

  

  
}

siguiente(){
  //reset de todas las variables
  this.puntuaciontotal;
  this.rendirse=false;
  this.distancia=1000;
  this.alertaproximidad=false;
  this.ubicacion=false;
  this.respuestasPosiblesBasicas=[];
  this.respuestasPosiblesBonus=[];
  this.respuesta=false;
  this.bonus=false;
  this.respuestabonus=false;
  this.Nota=0;
  this.index=this.index + 1;
  this.puntogeolocalizable=this.puntosgeolocalizables[this.index];
  this.preguntabasica=this.preguntasBasicas[this.index];
  this.preguntabonus=this.preguntasBonus[this.index];
   //volvemos al TERCER PASO
  
  // this.servidor.emit('etapaJuegoDeGeocaching', { id: this.alumnoId, puntuacion: this.puntuaciontotal, etapa: this.index});
}

finalizar(){
  this.route.navigateByUrl('tabs/inici');
}








async RespuestaCorrecta() {
  const confirm = await this.alertCtrl.create({
    header: 'RESPUESTA CORRECTA',
    message: '¿Quieres responder la pregunta Bonus?',
    buttons: [
      {
        text: 'SI',
        handler: () => {
          this.bonus=true;
          this.controlPreguntas=true;
          console.log('hay bonus');
          this.cd.detectChanges();
          
        }
      }, {
        text: 'NO',
        role: 'cancel',
        handler: () => {
          this.bonus=false;
          console.log('no hay bonus');
          this.Puntuacion();
          console.log("esta es la puntuacion total" + this.puntuaciontotal);
          if(this.puntosgeolocalizables[this.index + 1] !=null){
            
            console.log("pasamos al siguiente punto geo");
            this.siguiente();
            this.triggerNextPunto.emit();
            this.popCtrl.dismiss();
          
          }else{
            this.finalizar();
            this.popCtrl.dismiss();
            console.log("finalizamos");
          }
         
        }
      }
    ]
  });
  await confirm.present();
}

async RespuestaIncorrecta() {
  const confirm = await this.alertCtrl.create({
    header: 'RESPUESTA INCORRECTA',
    message: this.preguntasBasicas[this.index].FeedbackIncorrecto,
    buttons: [
        {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          this.bonus=false;
          console.log('error en la pregunta, no hay bonus');
          this.Puntuacion();
          console.log("esta es la puntuacion total" + this.puntuaciontotal);
          if(this.puntosgeolocalizables[this.index + 1] !=null){
            this.siguiente();
            console.log("pasamos al siguiente punto geo");
            this.triggerNextPunto.emit();
            this.popCtrl.dismiss();
          
          }else{
            this.finalizar();
            this.popCtrl.dismiss();
            console.log("finalizamos");
          }
        }
      }
    ]
  });
  await confirm.present();
}

async RespuestaCorrectaBonus() {
  const confirm = await this.alertCtrl.create({
    header: 'RESPUESTA BONUS CORRECTA',
    message: this.preguntasBonus[this.index].FeedbackCorrecto,
    buttons: [
      {
        text: 'OK',
        handler: () => {
          console.log('pregunta bonus correcta');
          this.Puntuacion();
          if(this.puntosgeolocalizables[this.index + 1] !=null){
            this.siguiente();
            console.log("pasamos al siguiente punto geo");
            this.triggerNextPunto.emit();
            this.popCtrl.dismiss();
          
          }else{
            this.finalizar();
            this.popCtrl.dismiss();
            console.log("finalizamos");
          }
        }
      }
    ]
  });
  await confirm.present();
}

async RespuestaIncorrectaBonus() {
  const confirm = await this.alertCtrl.create({
    header: 'RESPUESTA BONUS INCORRECTA',
    message: this.preguntasBonus[this.index].FeedbackIncorrecto,
    buttons: [
      {
        text: 'OK',
        handler: () => {
          console.log('pregunta bonus incorrecta');
          this.Puntuacion();
          if(this.puntosgeolocalizables[this.index + 1] !=null){
            this.siguiente();
            console.log("pasamos al siguiente punto geo");
            this.triggerNextPunto.emit();
            this.popCtrl.dismiss();
          
          }else{
            this.finalizar();
            this.popCtrl.dismiss();
            console.log("finalizamos");
          }
        }
      }
    ]
  });
  await confirm.present();
}


}


import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SesionService, PeticionesAPIService } from '../servicios';
import { NavController, AlertController, Platform, PopoverController } from '@ionic/angular';

import { CalculosService } from '../servicios/calculos.service';
import { Juego, AlumnoJuegoDeGeocaching, Escenario, PuntoGeolocalizable, MiAlumnoAMostrarJuegoDeGeocaching } from '../clases';
import { Pregunta } from '../clases/Pregunta';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';
import { Socket } from 'ngx-socket-io';
import { ResponderPreguntaJuegoGeocachingComponent } from '../responder-pregunta-juego-geocaching/responder-pregunta-juego-geocaching.component';

import * as L from 'leaflet';
import { JuegoDeGeocachingInfoComponent } from '../juego-de-geocaching-info/juego-de-geocaching-info.component';
import { JuegoDeGeocachingRankingComponent } from '../juego-de-geocaching-ranking/juego-de-geocaching-ranking.component';
import { tick } from '@angular/core/testing';
import { fromEvent } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-juego-de-geocaching',
  templateUrl: './juego-de-geocaching.page.html',
  styleUrls: ['./juego-de-geocaching.page.scss'],
})
export class JuegoDeGeocachingPage implements OnInit {
  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  @ViewChild('responder', {static: true}) responder: ElementRef;

  empezado: boolean = false;
  muestraInfo: boolean = true;
  rendirse: boolean = false;
  alertaproximidad: boolean = false;
  ubicacion: boolean = false;
  respuesta: boolean = false;
  bonus: boolean = false;
  respuestabonus: boolean = false;
  lat: number;
  lng: number;
  habilitarResponder: boolean = false;
  
  tablaJugadores: boolean = false;
  mostrarPregunta: boolean = false;



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
  pistaDificil: string;
  pistaFacil: string;
  preguntabasica: Pregunta;
  preguntabonus: Pregunta;

  MisAlumnosDelJuegoDeGeocaching: MiAlumnoAMostrarJuegoDeGeocaching[];
  alumnosTabla: MiAlumnoAMostrarJuegoDeGeocaching[];

  puntuaciontotal: number = 0;
  numeroEtapas: number;
  index: number = 0;
  distancia: number = 1000;
  identificador: any;

  distanciaNueva: number;


  coords: any = { lat:0, lng: 0 }

  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  respuestasPosiblesBasicas: string[] = [];
  respuestasPosiblesBonus: string[] = [];
  RespuestaEscogidaBasica: string;
  RespuestaEscogidaBonus: string;
  Nota: number = 0;
  PuntuacionInicial: string = '';
  ranking: number;
  iconoPosicion = L.icon({
    iconUrl: '../../assets/marker.png',

    iconSize:     [40, 45], // tamaño del marcador de la ubicacion
    iconAnchor:   [10, 45], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
 
  //definimos la posición de la respuesta correcta en cada pregunta basica y bonus

  ordenRespuestaCorrectaBasicas: number[] = [3, 1, 1, 0, 2, 0, 3, 3, 2, 0, 2, 1, 1,0 , 3, 2, 0, 0, 1, 3];
  ordenRespuestaCorrectaBonus: number[] = [2, 3, 3, 1, 0, 0, 2, 1, 1, 3, 2, 0, 2, 3, 2, 2, 1, 3, 0, 1, 2];
  map: L.Map;
  layerUbicacion: L.LayerGroup<any>;
 
  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private route: Router,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
    private alertCtrl: AlertController,
    private platform: Platform,
    public alertController: AlertController,
    private popCtrl: PopoverController,
    private cd: ChangeDetectorRef
    // private servidor: Socket
  ) { }

  ngOnInit() {
    // this.puntogeolocalizable.PistaDificil=" "
    this.pistaDificil = " ";
    this.pistaFacil = " ";
    this.alumnoId = this.sesion.DameAlumno().id;
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.puntuacionCorrecta = this.juegoSeleccionado.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.juegoSeleccionado.PuntuacionIncorrecta;
    this.puntuacionCorrectaBonus = this.juegoSeleccionado.PuntuacionCorrectaBonus;
    this.puntuacionIncorrectaBonus = this.juegoSeleccionado.PuntuacionIncorrectaBonus;
    this.idpreguntasBasicas = this.juegoSeleccionado.PreguntasBasicas;
    this.idpreguntasBonus = this.juegoSeleccionado.PreguntasBonus;
    this.identificador = navigator.geolocation.watchPosition((position) => {
      this.lat =  position.coords.latitude;
      this.lng =  position.coords.longitude;
      console.log('latitud ' + this.lat);
    console.log('longitud ' + this.lng );
    });
    setInterval(()=> {
      this.setLocation();
    },1000)
    // setInterval(()=> {
    //   console.log("estas dentro del interval")
    //   // navigator.geolocation.getCurrentPosition(position => {
    //   //   console.log("entro en el getcurrentposition")
    //   //   this.lat = position.coords.latitude;
    //   //   this.lng = position.coords.longitude;
    //   //   console.log(`Estas en ${this.lat}, ${this.lng}`);
    //     this.setLocation();
    //   });
    // },5000)

    this.peticionesAPI.DameInscripcionAlumnoJuegoDeGeocaching(this.alumnoId, this.juegoSeleccionado.id)
    .subscribe (res => {
      this.alumnoJuegoDeGeocaching = res;
      this.PuntuacionInicial = res[0].Puntuacion.toString();
    });
    this.peticionesAPI.DameEscenario(this.juegoSeleccionado.idescenario)
    .subscribe(res => {
      this.escenario = res;
      this.descripcion = res.Descripcion;
    });

    this.peticionesAPI.DamePuntosGeolocalizablesEscenario(this.juegoSeleccionado.idescenario)
    .subscribe(res => {
      this.puntosgeolocalizables = res.sort(function() {return Math.random() -0.5}); //desorden puntos geolocalizables
      this.puntogeolocalizable=res[this.index];
      this.numeroEtapas = res.length;
 
    });

    

     this.calculos.DamePreguntasJuegoDeGeocaching(this.idpreguntasBasicas).subscribe(lista => {
       this.preguntasBasicas = lista.sort(function() {return Math.random() -0.5});; //desorden preguntas basicas
       this.preguntabasica = lista[this.index];
      
      });

       this.calculos.DamePreguntasJuegoDeGeocaching(this.idpreguntasBonus).subscribe(lista => {
          this.preguntasBonus = lista.sort(function() {return Math.random() -0.5});; //desorden preguntas bonus
         this.preguntabonus = lista [this.index];
          });

    // this.preguntasBasicas = await this.calculos.DamePreguntasJuegoDeGeocaching(this.idpreguntasBasicas).toPromise();
    // if(this.preguntasBasicas != null){
    //   this.preguntasBasicas.sort(function() {return Math.random() -0.5});
    //   this.preguntabasica = this.preguntasBasicas[this.index];

    // }

    // this.preguntasBonus = await this.calculos.DamePreguntasJuegoDeGeocaching(this.idpreguntasBonus).toPromise();

    // if(this.preguntasBonus != null){
    //   this.preguntasBonus.sort(function() {return Math.random() -0.5});
    //   this.preguntabonus = this.preguntasBonus[this.index];
    // }

    // if(this.preguntasBonus != null && this.preguntasBasicas != null){
    //   this.preparacionpreguntas();
    // }

  
    if (this.juegoSeleccionado.JuegoTerminado) {
        this.MisAlumnosDelJuegoDeGeocaching = this.calculos.DameListaAlumnosJuegoGeocachingOrdenada(this.juegoSeleccionado.id);
      }
      // this.servidor.connect();

      setInterval(() => {
        this.updateRanking();
        
      }, 15000); 


  }
  ngAfterViewInit() {
    this.initMap();
  }
  private initMap(): void {
    this.map = L.map('map',{zoomControl:false}).setView([41.275500, 1.985452],17);
    this.map.invalidateSize();
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXJyZXplZXRhIiwiYSI6ImNsZnZnaHVkdDA3MXIzZm83bWduMnc0ZGIifQ.ZKp87eXXMQEO1MNCM_wXKA', {
    maxZoom: 20,
    minZoom: 13,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    window.dispatchEvent(new Event('resize'));

    this.layerUbicacion = L.layerGroup().addTo(this.map);
  }

  setLocation(): void {
    this.layerUbicacion.clearLayers();
    new L.Marker([this.lat, this.lng], {icon: this.iconoPosicion}).addTo(this.layerUbicacion);
    this.map.panTo(new L.LatLng(this.lat,this.lng));
    this.distancia = Math.trunc(this.calculateDistance(this.lng, Number(this.puntogeolocalizable.Longitud), this.lat, Number(this.puntogeolocalizable.Latitud)));
    console.log(`Estoy en latitud: ${this.lat} y longitud ${this.lng}, el punto que buscas esta en latitud: ${this.puntogeolocalizable.Latitud} y en longitud ${this.puntogeolocalizable.Longitud}, por lo que estas a ${this.distancia}`)
    if (this.distancia <= 35 && this.alertaproximidad === false) {
      this.caliente();
    }
    if (this.distancia <= 5 && this.ubicacion === false) {
      this.llegada();

    }
    else {
      this.frio();
    }
 
  }
  muestraPista(){
    Swal.fire({
      title: '¿Seguro que quieres ver la pista extra?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.rendirse = true;
      }
    })
  }

//   empezamos() {
//     this.empezado = true;

//     this.identificador = navigator.geolocation.watchPosition((position) => {
//       const lat =  position.coords.latitude;
//       const lon =  position.coords.longitude;
//       console.log('latitud ' + lat);
//       console.log('longitud ' + lon );

//       // tslint:disable-next-line:max-line-length
//       this.distancia = Math.trunc(this.calculateDistance(lon, Number(this.puntogeolocalizable.Longitud), lat, Number(this.puntogeolocalizable.Latitud)));
//       // tslint:disable-next-line:max-line-length
   


//       if (this.distancia <= 25 && this.alertaproximidad === false) {
//         this.caliente();
//       }
//       if (this.distancia <= 5 && this.ubicacion === false) {
//         this.llegada();
//       }
//       console.log(`Ahora mismo estas en ${this.lat} y ${this.lng} y estas a una distancia de ${this.distancia} del punto ${this.puntogeolocalizable.Latitud}, ${this.puntogeolocalizable.Longitud}`)
//     }, null, this.options);
    

// }

updateRanking(){
    
  this.calculos.PosicionAlumnoJuegoDeGeocaching(this.juegoSeleccionado.id, this.alumnoId).subscribe(
    res => {
      this.ranking = res;
    },
    error => {
      console.error(error);
    }
  );
  console.log(this.ranking);
  this.cd.markForCheck();
  
}


RankingClick(): void {
  this.rankingEvent();
}
async rankingEvent() {
  const popover = await this.popCtrl.create({
    component: JuegoDeGeocachingRankingComponent,
    cssClass: 'contact-popover'
  })

  return await popover.present();
}




  async ResponderPregunta(){

    this.mostrarPregunta = !this.mostrarPregunta;
    this.ubicacion = true;
    console.log(this.preguntasBasicas);
    console.log(this.preguntasBonus);
    console.log(this.preguntabasica);
    console.log("esta es la puntuacion que llevas ahora mismo:" + this.puntuaciontotal);

    const popover = await this.popCtrl.create({
      component: ResponderPreguntaJuegoGeocachingComponent,
      //cssClass: 'contact-popover'
      componentProps:{

        puntosgeolocalizables: this.puntosgeolocalizables,
        alumnoJuegoDeGeocaching: this.alumnoJuegoDeGeocaching,
        alumnoId: this.alumnoId,
        index: this.index,
        juegoSeleccionado: this.juegoSeleccionado,
        preguntasBasicas: this.preguntasBasicas,
        preguntasBonus: this.preguntasBonus,
        preguntabasica: this.preguntabasica,
        preguntabonus: this.preguntabonus,
        respuestasPosiblesBasicas: this.respuestasPosiblesBasicas,
        respuestasPosiblesBonus: this.respuestasPosiblesBonus,
        ordenRespuestaCorrectaBasicas: this.ordenRespuestaCorrectaBasicas,
        ordenRespuestaCorrectaBonus: this.ordenRespuestaCorrectaBonus,
        puntuacionInicial: this.PuntuacionInicial,
        puntuaciontotal: this.puntuaciontotal,
        puntuacionCorrecta: this.puntuacionCorrecta,
        puntuacionIncorrecta: this.puntuacionIncorrecta,
        puntuacionCorrectaBonus: this.puntuacionCorrectaBonus,
        puntuacionIncorrectaBonus: this.puntuacionIncorrectaBonus,
        rendirse: this.rendirse,
        


      }
    });

     popover.onDidDismiss().then(() => {

      this.recibirPuntos();
      this.siguiente();

     });


  
    return await popover.present();




  }





calculateDistance(lon1, lon2, lat1, lat2){
  let p = 0.017453292519943295;
  let c = Math.cos;
  let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((lon1- lon2) * p))) / 2;
  let dis = (12742 * Math.asin(Math.sqrt(a)))*1000;
  return dis
}



async popoverEvent() {
  const popover = await this.popCtrl.create({
    component: JuegoDeGeocachingInfoComponent,
    cssClass: 'contact-popover'
  })

  return await popover.present();
}

  
recibirPuntos(){
  this.puntuaciontotal = this.calculos.puntosGeocaching;
}




 

 siguiente(){
   //reset de todas las variables
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

  if(this.puntogeolocalizable[this.index] == undefined || this.puntogeolocalizable[this.index] == null){
    
    const final = this.alertCtrl.create({
        header: '¡Felicidades!',
        message: 'Has terminado el juego',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.Nota = this.puntuaciontotal;
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.PonerNotaAlumnoJuegoDeGeocaching(new AlumnoJuegoDeGeocaching (this.alumnoId, this.juegoSeleccionado.id,this.Nota, this.numeroEtapas), this.alumnoJuegoDeGeocaching[0].id)
              .subscribe(res => {
                console.log(res);
              });

            this.finalizar();

          }

        }]

    })
  }
   
   // this.servidor.emit('etapaJuegoDeGeocaching', { id: this.alumnoId, puntuacion: this.puntuaciontotal, etapa: this.index});
 }

finalizar(){
  this.route.navigateByUrl('tabs/inici');
}
display () {
  if (this.muestraInfo==true) {
    this.pistaDificil = this.puntogeolocalizable.PistaDificil;
    console.log("la pista dificil es"+this.pistaDificil)
    this.pistaFacil = this.puntogeolocalizable.PistaFacil;
    document.getElementById("juego").style.display = "block";
    this.map.invalidateSize();
    document.getElementById("botonInformacion").style.display = "none";
    document.getElementById("info").style.display = "none";
    this.muestraInfo = false;
    // this.empezamos();
  }
  else {
    document.getElementById("juego").style.display = "none";
    document.getElementById("info").style.display = "block";
    this.muestraInfo = true;
  }
}
mover(a: number){
  this.stepper.selectedIndex = a;
}





// ALERTAS

async popup() {
  const confirm = await this.alertCtrl.create({
    header: '¿Seguro que quieres salir?',
    message: 'Si sales tu puntuación será de 0',
    buttons: [
      {
        text: 'SI',
        handler: () => {
          this.Nota = 0.1;
          // tslint:disable-next-line:max-line-length
          this.peticionesAPI.PonerNotaAlumnoJuegoDeGeocaching(new AlumnoJuegoDeGeocaching (this.alumnoId, this.juegoSeleccionado.id,this.Nota, this.numeroEtapas), this.alumnoJuegoDeGeocaching[0].id)
            .subscribe(res => {
              console.log(res);
            });
         this.finalizar();
        }
      }, {
        text: 'NO',
        role: 'cancel',
        handler: () => {
          console.log('NO, ME QUEDO');
        }
      }
    ]
  });
  await confirm.present();
}

async Rendirse() {
  const confirm = await this.alertCtrl.create({
    header: '¿Seguro que quieres rendirte?',
    message: 'Vas a perder un 20% del valor de la puntuación correcta',
    buttons: [
      {
        text: 'SI',
        handler: () => {
          this.rendirse=true;
        }
      }, {
        text: 'NO',
        role: 'cancel',
        handler: () => {
          this.rendirse=false;
        }
      }
    ]
  });
  await confirm.present();
}


async caliente() {

  this.alertaproximidad=true;

  const confirm = await this.alertCtrl.create({
    header: 'CALIENTE,CALIENTE...',
    buttons: [
        {
        text: 'OK',
        role: 'cancel',
        handler: () => {

          // this.alertaproximidad=true;

          console.log('alerta mensaje caliente caliente');
        }
      }
    ]
  });
  document.getElementById("contestar").classList.remove("lejos");
  document.getElementById("contestar").classList.add("medio");
  await confirm.present();
}
async frio() {
  document.getElementById("contestar").classList.remove("medio");
  document.getElementById("contestar").classList.add("lejos");
}

async sacaDialogo() {
	const alert = await this.alertController.create({
	  header: "Alert",
	  subHeader: "Subtitle",
	  message: "This is an alert message.",
	  buttons: ["OK"],
	});

	await alert.present();
}

async llegada() {

  this.ubicacion=true;
  console.log('llegada: ' + this.ubicacion);
  navigator.geolocation.clearWatch (this.identificador);
  
  console.log('llegada al punto');
  console.log('clearwatch');

  this.habilitarResponder = true;
  this.responder.nativeElement.disabled=false;


  const confirm = await this.alertCtrl.create({
    header: '¡HAS LLEGADO!',
    buttons: [
        {
        text: 'OK',
        role: 'cancel',
        handler: () => {

          // this.ubicacion=true;
          // console.log('llegada' + this.ubicacion);
          // navigator.geolocation.clearWatch (this.identificador);
          // this.preparacionpreguntas();
          // console.log('llegada al punto');
          // console.log('clearwatch');


        }
      }
    ]
  });
  await confirm.present();
}

}



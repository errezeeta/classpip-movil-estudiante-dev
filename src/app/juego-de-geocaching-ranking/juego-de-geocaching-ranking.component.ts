import { Component, OnInit } from '@angular/core';
import { Juego, MiAlumnoAMostrarJuegoDeGeocaching } from '../clases';
import { CalculosService } from '../servicios/calculos.service';
import { SesionService } from '../servicios/sesion.service';


@Component({
  selector: 'app-juego-de-geocaching-ranking',
  templateUrl: './juego-de-geocaching-ranking.component.html',
  styleUrls: ['./juego-de-geocaching-ranking.component.scss'],
})
export class JuegoDeGeocachingRankingComponent implements OnInit {

  alumnoId: number;
  juegoSeleccionado: Juego;
  alumnosTabla: MiAlumnoAMostrarJuegoDeGeocaching[];


  constructor(
    private sesion: SesionService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.alumnoId = this.sesion.DameAlumno().id;
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.calculos.ListaParaRankingGeocaching(this.juegoSeleccionado.id).subscribe(
      alumnosTabla => {
        
        this.alumnosTabla = alumnosTabla;
        console.log(alumnosTabla);
      }
  
    );
  }

}

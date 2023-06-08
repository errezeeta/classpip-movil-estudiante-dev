import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegoDeGeocachingPage } from './juego-de-geocaching.page';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ResponderPreguntaJuegoGeocachingComponent } from '../responder-pregunta-juego-geocaching/responder-pregunta-juego-geocaching.component';


const routes: Routes = [
  {
    path: '',
    component: JuegoDeGeocachingPage
  }
];

@NgModule({
  imports: [
    MatStepperModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ResponderPreguntaJuegoGeocachingComponent],
  declarations: [JuegoDeGeocachingPage, ResponderPreguntaJuegoGeocachingComponent]
})
export class JuegoDeGeocachingPageModule {}

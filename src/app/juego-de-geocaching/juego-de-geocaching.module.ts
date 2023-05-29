import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegoDeGeocachingPage } from './juego-de-geocaching.page';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { JuegoDeGeocachingInfoComponent } from '../juego-de-geocaching-info/juego-de-geocaching-info.component';
import { JuegoDeGeocachingRankingComponent } from '../juego-de-geocaching-ranking/juego-de-geocaching-ranking.component';

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
    MatIconModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [JuegoDeGeocachingInfoComponent, JuegoDeGeocachingRankingComponent],
  declarations: [JuegoDeGeocachingPage, JuegoDeGeocachingInfoComponent, JuegoDeGeocachingRankingComponent]
})
export class JuegoDeGeocachingPageModule {}

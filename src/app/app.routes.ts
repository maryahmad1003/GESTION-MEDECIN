import { Routes } from '@angular/router';

import { MedecinFormComponent } from './components/medecin-form/medecin-form.component';
import { MedecinListComponent } from './components/medecin-list/medecin-list.component';

export const routes: Routes = [
  { path: '', component: MedecinFormComponent },
  { path: 'liste', component: MedecinListComponent }
];
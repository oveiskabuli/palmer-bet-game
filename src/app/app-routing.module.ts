import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PowerUpComponent } from './power-up/power-up.component';

const routes: Routes = [
  {
    path: 'power-up',
    component: PowerUpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

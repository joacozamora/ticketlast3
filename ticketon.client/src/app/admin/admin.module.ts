import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule, // AdminRoutingModule debe manejar las rutas
    RouterModule,       // Asegúrate de tener RouterModule aquí
  ],
})
export class AdminModule { }

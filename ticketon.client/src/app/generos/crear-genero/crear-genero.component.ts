import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-genero',
  templateUrl: './crear-genero.component.html',
  styleUrl: './crear-genero.component.css'
})
export class CrearGeneroComponent {

  constructor(private router: Router) { }

  guardarCambios() {
    //.....logica
    this.router.navigate(['/generos'])
  }
}

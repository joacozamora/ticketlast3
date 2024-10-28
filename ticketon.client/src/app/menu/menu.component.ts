import { Component, inject } from '@angular/core';
import { SeguridadService } from '../seguridad/seguridad.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AutorizadoComponent } from '../seguridad/autorizado/autorizado.component';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../carrito/carrito.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterLink, AutorizadoComponent, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  //seguridadService = inject(SeguridadService);
  
  constructor(public seguridadService: SeguridadService, public carritoService: CarritoService, private router: Router)  { }

  obtenerInicialUsuario(): string {
    const email = this.seguridadService.obtenerCampoJWT('email');
    return email ? email.charAt(0).toUpperCase() : '';
  }

  irACarrito(): void {
    this.router.navigate(['/carrito']);
    console.log("Ir al carrito");
  }

}

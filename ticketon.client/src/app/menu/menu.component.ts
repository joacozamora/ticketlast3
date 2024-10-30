import { Component, inject } from '@angular/core';
import { SeguridadService } from '../seguridad/seguridad.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AutorizadoComponent } from '../seguridad/autorizado/autorizado.component';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../carrito/carrito.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormularioAutenticacionComponent } from '../seguridad/formulario-autenticacion/formulario-autenticacion.component';
import { LoginComponent } from '../seguridad/login/login.component';
import { RegistroComponent } from '../seguridad/registro/registro.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterLink, AutorizadoComponent, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(
    public seguridadService: SeguridadService,
    public carritoService: CarritoService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  obtenerInicialUsuario(): string {
    const email = this.seguridadService.obtenerCampoJWT('email');
    return email ? email.charAt(0).toUpperCase() : '';
  }

  irACarrito(): void {
    this.router.navigate(['/carrito']);
  }

  abrirLogin(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '550px', 
      height: '700px', 
      panelClass: 'custom-dialog-container',
      disableClose: false,

      autoFocus: false,
      data: { titulo: 'Login' }
    });
  }

  abrirRegistro(): void {
    this.dialog.open(RegistroComponent, {
      width: '550px', 
      height: '700px',
      panelClass: 'custom-dialog-container',
      disableClose: false,
      data: { titulo: 'Registro' }
    });
  }
}

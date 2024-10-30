import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormularioAutenticacionComponent } from './formulario-autenticacion/formulario-autenticacion.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openAuthDialog(mode: 'login' | 'register', titulo: string): void {
    this.dialog.open(FormularioAutenticacionComponent, {
      width: '400px',
      data: { mode, titulo }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { BilleteraService } from '../../billetera/billetera.service';
import { EntradaVentaEditableDTO } from '../../billetera/billetera';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-entradas-venta-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-entradas-venta-admin.component.html'
})
export class ListaEntradasVentaAdminComponent implements OnInit {
  entradasVenta: EntradaVentaEditableDTO[] = [];
  correoBusqueda: string = '';
  mensajeError: string = '';

  constructor(private billeteraService: BilleteraService) { }

  

  ngOnInit(): void {
    this.cargarTodasEntradasVenta();
  }

  cargarTodasEntradasVenta(): void {
    this.billeteraService.obtenerTodasEntradasVenta().subscribe({
      next: (entradas) => {
        this.entradasVenta = entradas.map((entrada) => ({
          ...entrada,
          nuevoCorreo: '' // Campo temporal para edición
        }));
      },
      error: (err) => {
        console.error('Error al cargar todas las entradas venta:', err);
        this.mensajeError = 'No se pudieron cargar las entradas venta.';
      }
    });
  }

  actualizarCorreo(entrada: EntradaVentaEditableDTO): void {
    const nuevoCorreo = entrada.nuevoCorreo?.trim(); // Aseguramos que el correo no sea undefined o vacío

    if (!nuevoCorreo) {
      alert('Ingrese un nuevo correo válido.');
      return;
    }

    this.billeteraService.actualizarCorreo(entrada.id, nuevoCorreo).subscribe({
      next: () => {
        alert('Correo actualizado con éxito.');
        entrada.correo = nuevoCorreo; // Actualiza en el frontend
        entrada.nuevoCorreo = ''; // Limpia el campo
      },
      error: (err) => {
        console.error('Error al actualizar el correo:', err);
        alert('No se pudo actualizar el correo.');
      }
    });
  }

}

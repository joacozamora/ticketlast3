import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VentaService } from '../venta/venta.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirmacion',
    imports: [CommonModule],
    templateUrl: './confirmacion.component.html',
    styleUrls: ['./confirmacion.component.css']
})
export class ConfirmacionComponent implements OnInit {
  ventaId!: number;
  isProcessing: boolean = true;
  isSuccess: boolean | null = null;

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService
  ) { }

  ngOnInit(): void {
    // Capturar el parámetro ventaId
    this.route.queryParams.subscribe((params) => {
      this.ventaId = params['ventaId'];
      console.log('VentaId recibido:', this.ventaId);
      if (this.ventaId) {
        this.confirmarVenta();
      } else {
        console.error('No se proporcionó ventaId en la URL.');
        this.isProcessing = false;
        this.isSuccess = false;
      }
    });
  }

  confirmarVenta(): void {
    this.ventaService.confirmarVenta(this.ventaId).subscribe(
      () => {
        console.log('Venta confirmada exitosamente.');
        this.isProcessing = false;
        this.isSuccess = true;
      },
      (error) => {
        console.error('Error al confirmar la venta:', error);
        this.isProcessing = false;
        this.isSuccess = false;
      }
    );
  }
}

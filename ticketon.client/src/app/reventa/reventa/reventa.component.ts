import { Component, OnInit } from '@angular/core';
import { ReventaService } from '../reventa.service';
import { ReventaDTO } from '../reventa';
import { CommonModule } from '@angular/common';
declare var MercadoPago: any;

@Component({
    selector: 'app-reventa',
    imports: [CommonModule],
    templateUrl: './reventa.component.html',
    styleUrls: ['./reventa.component.css']
})
export class ReventaComponent implements OnInit {
  reventas: ReventaDTO[] = [];
  isProcessing: boolean = false;

  constructor(private reventaService: ReventaService) { }

  ngOnInit(): void {
    this.cargarReventas();
  }

  cargarReventas(): void {
    this.reventaService.obtenerReventas().subscribe(
      (data: ReventaDTO[]) => {
        this.reventas = data;
      },
      (error) => {
        console.error('Error al cargar las reventas:', error);
      }
    );
  }

  comprarReventa(reventaId: number): void {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.reventaService.crearPreferencia(reventaId).subscribe(
      (response) => {
        if (response?.preferenceId) {
          this.pagarConMercadoPago(response.preferenceId, reventaId);
        } else {
          console.error('No se recibió un PreferenceId válido.');
          alert('Hubo un problema al generar la preferencia de pago.');
          this.isProcessing = false;
        }
      },
      (error) => {
        console.error('Error al crear la preferencia:', error);
        alert('Hubo un problema al generar la preferencia de pago.');
        this.isProcessing = false;
      }
    );
  }

  pagarConMercadoPago(preferenceId: string, reventaId: number): void {
    const mp = new MercadoPago('APP_USR-64585ae8-8796-44db-8f01-af9f6a1ed9ee');
    mp.checkout({
      preference: { id: preferenceId },
      autoOpen: true,
      onSuccess: () => {
        this.reventaService.confirmarReventa(reventaId).subscribe(
          () => {
            alert('Compra de reventa realizada con éxito.');
            this.cargarReventas();
            this.isProcessing = false;
          },
          (error) => {
            console.error('Error al confirmar la reventa:', error);
            alert('Hubo un problema al confirmar la reventa.');
            this.isProcessing = false;
          }
        );
      },
      onError: (error: any) => {
        console.error('Error en el pago:', error);
        alert('Hubo un error al procesar el pago.');
        this.isProcessing = false;
      },
      onClose: () => {
        this.isProcessing = false;
      },
    });
  }
}



import { Component, OnInit } from '@angular/core';
import { MercadoPagoService } from '../reventa/mercado-pago.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmacion-mercado-pago',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmacion-mercado-pago.component.html',
  styleUrl: './confirmacion-mercado-pago.component.css'
})
export class ConfirmacionMercadoPagoComponent implements OnInit {
  mensaje: string = '';
  estado: 'exito' | 'error' | null = null;

  constructor(
    private mercadoPagoService: MercadoPagoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const estado = params['estado'];
      if (estado === 'exito') {
        this.mensaje = '¡Vinculación exitosa con MercadoPago!';
        this.estado = 'exito';

        // Redirigir al flujo del usuario después de la confirmación
        setTimeout(() => {
          this.router.navigate(['/crear-reventa'], { queryParams: { entradaVentaId: this.getEntradaVentaIdFromSession() } });
        }, 3000); // Espera 3 segundos antes de redirigir
      } else {
        this.mensaje = 'Hubo un problema al vincular tu cuenta con MercadoPago.';
        this.estado = 'error';
      }
    });
  }

  getEntradaVentaIdFromSession(): number {
    // Obtén el entradaVentaId guardado anteriormente (puedes usar sessionStorage/localStorage)
    return Number(sessionStorage.getItem('entradaVentaId') || 0);
  }


  regresar(): void {
    this.router.navigate(['/']); // Ajusta esta ruta según tu navegación principal
  }
}

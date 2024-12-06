import { Component, OnInit } from '@angular/core';
import { CarritoService } from './carrito.service';
import { CarritoItem } from './carrito-item';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VentaService } from '../venta/venta.service';
declare var MercadoPago: any;

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  carritoItems: CarritoItem[] = [];
  isProcessing: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private ventaService: VentaService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Cargar los elementos del carrito al iniciar el componente
    this.cargarCarrito();
  }

  pagarConMercadoPago(preferenceId: string, ventaId: number): void {
    // Inicializar Mercado Pago y abrir el checkout
    const mp = new MercadoPago('APP_USR-64585ae8-8796-44db-8f01-af9f6a1ed9ee');
    mp.checkout({
      preference: {
        id: preferenceId,
      },
      autoOpen: true,
      onSuccess: () => {
        // Confirmar la venta en el backend tras un pago exitoso
        this.ventaService.confirmarVenta(ventaId).subscribe(
          () => {
            this.carritoService.vaciarCarrito(); // Vaciar el carrito tras la confirmación
            alert('Pago realizado con éxito. Entradas generadas.');
            this.cargarCarrito(); // Actualizar la vista del carrito
            this.isProcessing = false;
          },
          (error) => {
            console.error('Error al confirmar la venta:', error);
            alert('Pago exitoso, pero hubo un problema al confirmar la venta.');
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

  cargarCarrito(): void {
    // Cargar los elementos del carrito desde el CarritoService
    this.carritoItems = this.carritoService.obtenerCarrito();
  }

  eliminarDelCarrito(entradaId: number): void {
    // Eliminar un elemento del carrito por su entradaId
    this.carritoService.eliminarDelCarrito(entradaId);
    this.cargarCarrito(); // Recargar la lista de elementos
  }

  calcularTotal(): number {
    // Calcular el total de los precios en el carrito
    return this.carritoItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  confirmarCompra(): void {
    if (this.carritoItems.length === 0) {
      alert('No hay entradas en el carrito.');
      return;
    }

    if (this.isProcessing) return;
    this.isProcessing = true;

    // Crear la venta en el backend
    this.ventaService.crearVenta(this.carritoItems).subscribe(
      (response: any) => {
        if (response && response.preferenceId && response.ventaId) {
          // Iniciar el pago con Mercado Pago
          this.pagarConMercadoPago(response.preferenceId, response.ventaId);
        } else {
          alert('No se pudo generar la preferencia de pago.');
          this.isProcessing = false;
        }
      },
      (error) => {
        console.error('Error al confirmar la compra:', error);
        alert('Hubo un error al procesar la compra.');
        this.isProcessing = false;
      }
    );
  }
}

//import { Component, OnInit } from '@angular/core';
//import { CarritoService } from './carrito.service';
//import { CarritoItem } from './carrito-item';
//import { CommonModule } from '@angular/common';
//import { ActivatedRoute, RouterLink } from '@angular/router';
//import { VentaService } from '../venta/venta.service';
//declare var MercadoPago: any;

//@Component({
//  selector: 'app-carrito',
//  standalone: true,
//  imports: [CommonModule, RouterLink],
//  templateUrl: './carrito.component.html',
//  styleUrls: ['./carrito.component.css']
//})
//export class CarritoComponent implements OnInit {
//  carritoItems: CarritoItem[] = [];
//  isProcessing: boolean = false;

//  constructor(
//    private carritoService: CarritoService,
//    private ventaService: VentaService,
//    private route: ActivatedRoute
//  ) { }

//  ngOnInit(): void {
//    this.cargarCarrito();

//  }


//  pagarConMercadoPago(preferenceId: string, ventaId: number): void {
//    const mp = new MercadoPago('APP_USR-64585ae8-8796-44db-8f01-af9f6a1ed9ee');
//    mp.checkout({
//      preference: {
//        id: preferenceId
//      },
//      autoOpen: true,
//      onSuccess: () => {
//        // Confirmar la venta en el backend tras el pago exitoso
//        this.ventaService.confirmarVenta(ventaId).subscribe(
//          () => {
//            this.carritoService.vaciarCarrito(); // Vaciar el carrito tras la confirmación
//            alert('Pago realizado con éxito. Entradas generadas.');
//            this.cargarCarrito(); // Actualizar la vista del carrito
//            this.isProcessing = false;
//          },
//          (error) => {
//            console.error('Error al confirmar la venta:', error);
//            alert('Pago exitoso, pero hubo un problema al confirmar la venta.');
//            this.isProcessing = false;
//          }
//        );
//      },
//      onError: (error: any) => {
//        console.error('Error en el pago:', error);
//        alert('Hubo un error al procesar el pago.');
//        this.isProcessing = false;
//      },
//      onClose: () => {
//        this.isProcessing = false;
//      }
//    });
//  }

//  cargarCarrito(): void {
//    this.carritoItems = this.carritoService.obtenerCarrito();
//  }

//  eliminarDelCarrito(entradaId: number): void {
//    this.carritoService.eliminarDelCarrito(entradaId);
//    this.cargarCarrito();
//  }

//  calcularTotal(): number {
//    return this.carritoItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
//  }

//  confirmarCompra(): void {
//    if (this.carritoItems.length === 0) {
//      alert('No hay entradas en el carrito.');
//      return;
//    }

//    if (this.isProcessing) return;
//    this.isProcessing = true;

//    this.ventaService.crearVenta(this.carritoItems).subscribe(
//      (response: any) => {
//        if (response && response.preferenceId && response.ventaId) {
//          this.pagarConMercadoPago(response.preferenceId, response.ventaId);
//        } else {
//          alert('No se pudo generar la preferencia de pago.');
//          this.isProcessing = false;
//        }
//      },
//      (error) => {
//        console.error('Error al confirmar la compra:', error);
//        alert('Hubo un error al procesar la compra.');
//        this.isProcessing = false;
//      }
//    );
//  }
//}

  //confirmarCompra(): void {
  //  this.ventaService.crearVenta(this.carritoItems).subscribe(
  //    (response: any) => {
  //      this.pagarConMercadoPago(response.preferenceId);
  //    },
  //    (error) => {
  //      console.error('Error al confirmar la compra:', error);
  //      alert('Hubo un error al procesar la compra.');
  //    }
  //  );
  //}


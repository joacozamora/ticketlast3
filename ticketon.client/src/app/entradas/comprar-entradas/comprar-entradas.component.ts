import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from '../../carrito/carrito.service';
import { EventosService } from '../../eventos/eventos.service';
import { EntradasService } from '../../entradas/entradas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Entrada } from '../entradas';

@Component({
  selector: 'app-comprar-entradas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comprar-entradas.component.html',
  styleUrls: ['./comprar-entradas.component.css']
})
export class ComprarEntradasComponent implements OnInit {
  evento: any;

  entradas: Entrada[] = [];
  cantidadEntradas: number = 1;
  precioTotal: number = 0;
  entradaSeleccionada: Entrada | null = null; // Nueva propiedad para la entrada seleccionada

  constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoService,
    private eventoService: EventosService,
    private entradasService: EntradasService
  ) { }

  ngOnInit(): void {
    // Obteniendo datos del evento y sus entradas
    this.route.params.subscribe(params => {
      const eventoId = +params['id'];
      if (eventoId > 0) {
        this.cargarEvento(eventoId);
        this.cargarEntradasPorEvento(eventoId);
      }
    });
  }

  cargarEvento(eventoId: number): void {
    this.eventoService.obtenerPorId(eventoId).subscribe(
      evento => {
        this.evento = evento;
        this.calcularTotal();
      },
      error => {
        console.error('Error al cargar el evento:', error);
      }
    );
  }

  cargarEntradasPorEvento(eventoId: number): void {
    this.entradasService.obtenerEntradasPorEvento(eventoId).subscribe(
      entradas => {
        this.entradas = entradas;
      },
      error => {
        console.error('Error al cargar las entradas del evento:', error);
      }
    );
  }

  seleccionarEntrada(entrada: Entrada): void {
    this.entradaSeleccionada = entrada; // Seleccionando la entrada
    this.calcularTotal();
  }

  calcularTotal(): void {
    if (this.entradaSeleccionada && this.entradaSeleccionada.precio) {
      this.precioTotal = this.cantidadEntradas * this.entradaSeleccionada.precio; // Usando la entrada seleccionada
    }
  }
  

  incrementarEntradas() {
    this.cantidadEntradas++;
  }

  decrementarEntradas() {
    if (this.cantidadEntradas > 1) {
      this.cantidadEntradas--;
    }
  }

  agregarAlCarrito(): void {
    if (this.entradaSeleccionada) {
      this.carritoService.agregarAlCarrito({
        entradaId: this.entradaSeleccionada.id,
        nombreEntrada: this.entradaSeleccionada.nombreTanda,
        cantidad: this.cantidadEntradas,
        precio: this.entradaSeleccionada.precio,
        total: this.precioTotal,
        nombreEvento: this.evento.nombre,
        imagenEvento: this.evento.imagen
      });
    }
  }

  actualizarCantidad(cantidad: number): void {
    this.cantidadEntradas = cantidad;
    this.calcularTotal();
  }
}



//import { Component, OnInit } from '@angular/core';
//import { ActivatedRoute } from '@angular/router';
//import { CarritoService } from '../../carrito/carrito.service';
//import { EventosService } from '../../eventos/eventos.service';
//import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';

//@Component({
//  selector: 'app-comprar-entradas',
//  standalone: true,
//  imports: [CommonModule, FormsModule],
//  templateUrl: './comprar-entradas.component.html',
//  styleUrls: ['./comprar-entradas.component.css']
//})
//export class ComprarEntradasComponent implements OnInit {
//  evento: any;
//  cantidadEntradas: number = 1;
//  precioTotal: number = 0;

//  constructor(
//    private route: ActivatedRoute,
//    private carritoService: CarritoService,
//    private eventoService: EventosService
//  ) { }


//  ngOnInit(): void {
//    this.route.params.subscribe(params => {
//      const eventoId = +params['id']; // El '+' convierte el string a número
//      console.log("Evento ID desde params:", eventoId);  // Verificar que obtienes el ID correctamente
//      if (eventoId > 0) {
//        this.cargarEvento(eventoId);
//      } else {
//        console.error("ID de evento no válido:", eventoId);
//      }
//    });
//  }



//  cargarEvento(eventoId: number): void {
//    this.eventoService.obtenerPorId(eventoId).subscribe(
//      evento => {
//        console.log("Evento:", evento);  // Verifica si llega el evento correctamente
//        this.evento = evento;
//        this.calcularTotal();
//      },
//      error => {
//        console.error("Error al cargar el evento:", error);
//      }
//    );
//  }

//  calcularTotal(): void {
//    if (this.evento && this.evento.precio) {
//      this.precioTotal = this.cantidadEntradas * this.evento.precio;
//    }
//  }

//  agregarAlCarrito(): void {
//    this.carritoService.agregarAlCarrito({
//        entradaId: this.evento.id,
//        cantidad: this.cantidadEntradas,
//        nombreEvento: this.evento.nombre,
//        precio: this.evento.precio,
//        total: this.precioTotal,
//        imagenEvento: this.evento.imagen,
//        nombreEntrada: ''
//    });
//  }

//  actualizarCantidad(cantidad: number): void {
//    this.cantidadEntradas = cantidad;
//    this.calcularTotal();
//  }
//}

//import { Component, OnInit } from '@angular/core';
//import { ActivatedRoute } from '@angular/router';
//import { CarritoService } from '../../carrito/carrito.service';
//import { EventosService } from '../../eventos/eventos.service';
//import { EntradasService } from '../../entradas/entradas.service';
//import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';
//import { Entrada } from '../entradas';

//@Component({
//  selector: 'app-comprar-entradas',
//  standalone: true,
//  imports: [CommonModule, FormsModule],
//  templateUrl: './comprar-entradas.component.html',
//  styleUrls: ['./comprar-entradas.component.css']
//})
//export class ComprarEntradasComponent implements OnInit {
//  evento: any;
//  entradas: Entrada[] = [];
//  cantidadEntradas: number = 1;
//  precioTotal: number = 0;

//  constructor(
//    private route: ActivatedRoute,
//    private carritoService: CarritoService,
//    private eventoService: EventosService,
//    private entradasService: EntradasService
//  ) { }

//  ngOnInit(): void {
//    // Obteniendo datos del evento y sus entradas
//    this.route.params.subscribe(params => {
//      const eventoId = +params['id'];
//      if (eventoId > 0) {
//        this.cargarEvento(eventoId);
//        this.cargarEntradasPorEvento(eventoId);
//      }
//    });
//  }

//  cargarEvento(eventoId: number): void {
//    this.eventoService.obtenerPorId(eventoId).subscribe(
//      evento => {
//        this.evento = evento;
//        this.calcularTotal();
//      },
//      error => {
//        console.error('Error al cargar el evento:', error);
//      }
//    );
//  }

//  cargarEntradasPorEvento(eventoId: number): void {
//    this.entradasService.obtenerEntradasPorEvento(eventoId).subscribe(
//      entradas => {
//        this.entradas = entradas;
//      },
//      error => {
//        console.error("Error al cargar las entradas del evento:", error);
//      }
//    );
//  }

//  calcularTotal(): void {
//    if (this.evento && this.evento.precio) {
//      this.precioTotal = this.cantidadEntradas * this.evento.precio;
//    }
//  }

//  agregarAlCarrito(): void {
//    this.carritoService.agregarAlCarrito({
//      entradaId: this.evento.id,
//      cantidad: this.cantidadEntradas,
//      nombreEvento: this.evento.nombre,
//      precio: this.evento.precio,
//      total: this.precioTotal,
//      imagenEvento: this.evento.imagen,
//      nombreEntrada: this.evento.nombreTanda
//    });
//  }

//  actualizarCantidad(cantidad: number): void {
//    this.cantidadEntradas = cantidad;
//    this.calcularTotal();
//  }
//}

//import { Component, OnInit } from '@angular/core';
//import { ActivatedRoute } from '@angular/router';
//import { CarritoService } from '../../carrito/carrito.service';
//import { EventosService } from '../../eventos/eventos.service';
//import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';

//@Component({
//  selector: 'app-comprar-entradas',
//  standalone: true,
//  imports: [CommonModule, FormsModule],
//  templateUrl: './comprar-entradas.component.html',
//  styleUrls: ['./comprar-entradas.component.css']
//})
//export class ComprarEntradasComponent implements OnInit {
//  evento: any;
//  cantidadEntradas: number = 1;
//  precioTotal: number = 0;

//  constructor(
//    private route: ActivatedRoute,
//    private carritoService: CarritoService,
//    private eventoService: EventosService
//  ) { }

//  ngOnInit(): void {
//    this.route.params.subscribe(params => {
//      const eventoId = +params['id'];
//      if (eventoId > 0) {
//        this.cargarEvento(eventoId);
//      }
//    });
//  }

//  cargarEvento(eventoId: number): void {
//    this.eventoService.obtenerPorId(eventoId).subscribe(
//      evento => {
//        this.evento = evento;
//        this.calcularTotal();
//      },
//      error => {
//        console.error('Error al cargar el evento:', error);
//      }
//    );
//  }

//  calcularTotal(): void {
//    if (this.evento && this.evento.precio) {
//      this.precioTotal = this.cantidadEntradas * this.evento.precio;
//    }
//  }

//  agregarAlCarrito(): void {
//    this.carritoService.agregarAlCarrito({
//      entradaId: this.evento.id,
//      cantidad: this.cantidadEntradas,
//      nombreEvento: this.evento.nombre,
//      precio: this.evento.precio,
//      total: this.precioTotal,
//      imagenEvento: this.evento.imagen,
//      nombreEntrada: this.evento.nombreTanda // O puedes especificar otro valor si corresponde
//    });
//  }

//  actualizarCantidad(cantidad: number): void {
//    this.cantidadEntradas = cantidad;
//    this.calcularTotal();
//  }
//}



//cargarEvento(): void {
//  const eventoId = Number(this.route.snapshot.paramMap.get('id'));
//  console.log("Evento ID:", eventoId);  // <--- Verifica si el eventoId se obtiene correctamente
//  this.eventoService.obtenerPorId(eventoId).subscribe(evento => {
//    console.log("Evento:", evento);  // <--- Verifica si el evento llega correctamente
//    this.evento = evento;
//    this.calcularTotal();
//  });
//}
//cargarEvento(): void {
//  const eventoId = Number(this.route.snapshot.paramMap.get('id'));

//  if (isNaN(eventoId) || eventoId <= 0) {
//    console.error("ID del evento no válido:", eventoId);  // Mensaje de error si el ID no es válido
//    return; // Salir si el ID no es válido
//  }

//  console.log("Evento ID:", eventoId);  // Verificación del ID correcto
//  this.eventoService.obtenerPorId(eventoId).subscribe(
//    evento => {
//      if (evento) {
//        console.log("Evento:", evento);  // Verificación de que se obtenga el evento
//        this.evento = evento;
//        this.calcularTotal();
//      } else {
//        console.error("No se encontró el evento con ID:", eventoId);  // Error si el evento no existe
//      }
//    },
//    error => {
//      console.error("Error al cargar el evento:", error);  // Manejo de errores en la carga
//    }
//  );
//}

import { Component, OnInit } from '@angular/core';
import { BilleteraService } from './billetera.service';
import { SeguridadService } from '../seguridad/seguridad.service';
import { EntradaVentaDTO } from '../billetera/billetera';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-billetera',
  standalone: true,
  imports: [CommonModule, QRCodeModule, RouterModule],
  templateUrl: './billetera.component.html',
  styleUrls: ['./billetera.component.css']
})
export class BilleteraComponent implements OnInit {
  entradasBilletera: EntradaVentaDTO[] = [];

  constructor(
    private billeteraService: BilleteraService,
    private seguridadService: SeguridadService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const correoUsuario = this.obtenerCorreoUsuario();
    this.cargarEntradasBilletera(correoUsuario);
  }

  obtenerCorreoUsuario(): string {
    return this.seguridadService.obtenerCampoJWT('email');
  }

  cargarEntradasBilletera(correo: string): void {
    this.billeteraService.obtenerEntradasPorCorreo(correo).subscribe(
      (entradas) => {
        this.entradasBilletera = entradas.map((entrada) => ({
          ...entrada,
          imagenEvento: entrada.imagenEvento instanceof File
            ? URL.createObjectURL(entrada.imagenEvento)
            : entrada.imagenEvento || 'default.jpg'
        })) as EntradaVentaDTO[];
      },
      (error) => {
        console.error('Error al cargar las entradas de la billetera:', error);
      }
    );
  }

  irAReventa(entrada: EntradaVentaDTO): void {
    this.router.navigate([`/crear-reventa/${entrada.id}`]);
  }

  irAlEvento(entrada: EntradaVentaDTO): void {
    this.router.navigate([`/comprar-entradas/${entrada.eventoId}`]);
  }
}



//import { Component, OnInit } from '@angular/core';
//import { BilleteraService } from './billetera.service';
//import { SeguridadService } from '../seguridad/seguridad.service';
//import { EntradaVentaDTO } from '../billetera/billetera'; // Asegúrate de que este DTO esté correcto
//import { CommonModule } from '@angular/common';
//import { QRCodeModule } from 'angularx-qrcode';
//import { Router, RouterLink, RouterModule } from '@angular/router';

//@Component({
//  selector: 'app-billetera',
//  standalone: true,
//  imports: [CommonModule, QRCodeModule, RouterModule],
//  templateUrl: './billetera.component.html',
//  styleUrls: ['./billetera.component.css']
//})
//export class BilleteraComponent implements OnInit {
//  entradasBilletera: EntradaVentaDTO[] = [];
//  usuarioId: string = '';
  

//  constructor(
//    private billeteraService: BilleteraService,
//    private seguridadService: SeguridadService,
//    private router: Router
//  ) { }

//  ngOnInit(): void {
//    const correoUsuario = this.obtenerCorreoUsuario();
//    this.cargarEntradasBilletera(correoUsuario);
//  }

//  obtenerCorreoUsuario(): string {
//    return this.seguridadService.obtenerCampoJWT('email');
//  }

//  cargarEntradasBilletera(correo: string): void {
//    this.billeteraService.obtenerEntradasPorCorreo(correo).subscribe(
//      (entradas) => {
//        this.entradasBilletera = entradas.map((entrada) => ({
//          ...entrada,
//          imagenEvento: entrada.imagenEvento instanceof File
//            ? URL.createObjectURL(entrada.imagenEvento) // Si es un File, lo convertimos a URL
//            : entrada.imagenEvento || 'default.jpg' // Usa default.jpg si no hay imagen
//        })) as EntradaVentaDTO[]; // Asegúrate de que esto se trate como EntradaVentaDTO[]
//      },
//      (error) => {
//        console.error('Error al cargar las entradas de la billetera:', error);
//      }
//    );
//  }

//  revender(entrada: EntradaVentaDTO): void {
//    // Lógica para iniciar el proceso de reventa
//    console.log('Iniciando reventa para:', entrada);
//    // Aquí podrías navegar a un componente de reventa con los datos de la entrada
//    this.router.navigate(['/crear-reventa', entrada.id]); // Asegúrate de que la ruta exista
//  }

//  irAlEvento(entrada: EntradaVentaDTO): void {
//    // Lógica para navegar al evento
//    console.log('Navegando al evento:', entrada);
//    // Implementa la lógica de navegación, usando el Router de Angular.
//    this.router.navigate(['/comprar-entrada', entrada.entradaId]); // Asumiendo que tienes un componente de evento
//  }

//  irAReventa(entrada: EntradaVentaDTO): void {
//    // Redirige al usuario a la página de reventa
//    this.router.navigate(['/crear-reventa'], { queryParams: { entradaId: entrada.id } });
//  }
//}



//import { Component, OnInit } from '@angular/core';
//import { BilleteraService } from './billetera.service';
//import { SeguridadService } from '../seguridad/seguridad.service';
//import { BilleteraDTO } from './billetera';
//import { CommonModule } from '@angular/common';
//import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';

//@Component({
//  selector: 'app-billetera',
//  standalone: true,
//  imports: [CommonModule, QRCodeModule],
//  templateUrl: './billetera.component.html',
//  styleUrls: ['./billetera.component.css']
//})
//export class BilleteraComponent implements OnInit {
//  entradasBilletera: BilleteraDTO[] = []; 
//  usuarioId: string = '';

//  constructor(
//    private billeteraService: BilleteraService,
//    private seguridadService: SeguridadService
//  ) { }

//  ngOnInit(): void {
    
//    const correoUsuario = this.obtenerCorreoUsuario();
//    this.cargarEntradasBilletera(correoUsuario);
//  }

//  obtenerCorreoUsuario(): string {
    
//    return this.seguridadService.obtenerCampoJWT('email');
//  }

//  cargarEntradasBilletera(correo: string): void {
    
//    this.billeteraService.obtenerEntradasBilleteraPorCorreo(correo).subscribe(
//      (entradas) => {
//        this.entradasBilletera = entradas;
//      },
//      (error) => {
//        console.error('Error al cargar las entradas de la billetera:', error);
//      }
//    );
//  }
//}

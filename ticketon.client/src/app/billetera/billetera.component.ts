import { Component, OnInit } from '@angular/core';
import { BilleteraService } from './billetera.service';
import { SeguridadService } from '../seguridad/seguridad.service';
import { EntradaVentaDTO } from '../billetera/billetera'; // Asegúrate de que este DTO esté correcto
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-billetera',
  standalone: true,
  imports: [CommonModule, QRCodeModule],
  templateUrl: './billetera.component.html',
  styleUrls: ['./billetera.component.css']
})
export class BilleteraComponent implements OnInit {
  entradasBilletera: EntradaVentaDTO[] = [];
  usuarioId: string = '';

  constructor(
    private billeteraService: BilleteraService,
    private seguridadService: SeguridadService
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
        this.entradasBilletera = entradas;
      },
      (error) => {
        console.error('Error al cargar las entradas de la billetera:', error);
      }
    );
  }
}



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

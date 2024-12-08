import { Component, OnInit, ElementRef } from '@angular/core';
import { BilleteraService } from './billetera.service';
import { SeguridadService } from '../seguridad/seguridad.service';
import { EntradaVentaDTO } from '../billetera/billetera';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as QRCode from 'qrcode';

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
    console.log('Redirigiendo con EntradaVentaId:', entrada.id); // Para verificar el ID antes de redirigir
    this.router.navigate(['/crear-reventa'], { queryParams: { entradaVentaId: entrada.id } });
  }

  irAlEvento(entrada: EntradaVentaDTO): void {
    this.router.navigate([`/comprar-entradas/${entrada.eventoId}`]);
  }

  async generarCodigoQRBase64(texto: string): Promise<string> {
    try {
      return await QRCode.toDataURL(texto);
    } catch (error) {
      console.error('Error al generar el QR en base64:', error);
      return '';
    }
  }
  async convertirImagenABase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  async imprimirEntrada(entrada: EntradaVentaDTO): Promise<void> {
    // Asegurarse de que el código QR esté en formato base64
    if (!entrada.codigoQR.startsWith('data:image')) {
      entrada.codigoQR = await this.generarCodigoQRBase64(entrada.codigoQR);
    }

    // Crear un contenedor temporal con los datos relevantes
    const printContainer = document.createElement('div');
    printContainer.style.padding = '20px';
    printContainer.style.border = '1px solid #ddd';
    printContainer.style.backgroundColor = '#fff';
    printContainer.style.textAlign = 'center';

    // Agregar la imagen del evento, centrada
    if (entrada.imagenEvento) {
      try {
        const imagenBase64 = await this.convertirImagenABase64(entrada.imagenEvento as string);
        const imagenEvento = document.createElement('img');
        imagenEvento.src = imagenBase64;
        imagenEvento.style.width = '150px'; // Ajusta el tamaño según sea necesario
        imagenEvento.style.height = 'auto';
        imagenEvento.style.display = 'block';
        imagenEvento.style.margin = '0 auto 10px'; // Centrar y agregar margen inferior
        printContainer.appendChild(imagenEvento);
      } catch (error) {
        console.error('Error al convertir la imagen a base64:', error);
      }
    }

    // Agregar el nombre de la entrada
    const nombreEntrada = document.createElement('h3');
    nombreEntrada.textContent = entrada.nombreEntrada;
    nombreEntrada.style.fontSize = '240px';
    nombreEntrada.style.marginBottom = '100px';
    printContainer.appendChild(nombreEntrada);

    // Agregar la fecha de asignación
    const fechaAsignacion = document.createElement('p');
    fechaAsignacion.textContent = `Fecha de Asignación: ${new Date(entrada.fechaAsignacion).toLocaleDateString()}`;
    fechaAsignacion.style.fontSize = '140px';
    fechaAsignacion.style.marginBottom = '100px';
    printContainer.appendChild(fechaAsignacion);

    // Crear un elemento de imagen para el QR, centrado
    if (entrada.codigoQR) {
      const qrImage = document.createElement('img');
      qrImage.src = entrada.codigoQR; // Asegúrate de que sea una imagen base64
      qrImage.style.width = '1000px';
      qrImage.style.height = '1000px';
      qrImage.style.display = 'block';
      qrImage.style.margin = '0 auto 10px'; // Centrar y agregar margen inferior
      printContainer.appendChild(qrImage);
    }

    // Agregar el contenedor al body para capturarlo
    document.body.appendChild(printContainer);

    // Usar html2canvas para capturar el contenido del contenedor y generar el PDF
    html2canvas(printContainer, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      // Descargar el PDF
      pdf.save(`entrada_${entrada.nombreEntrada.replace(/\s/g, '_')}.pdf`);

      // Remover el contenedor temporal después de la impresión
      document.body.removeChild(printContainer);
    }).catch(error => {
      console.error('Error al generar el PDF:', error);
      document.body.removeChild(printContainer);
    });
  }


}





//import { Component, OnInit } from '@angular/core';
//import { BilleteraService } from './billetera.service';
//import { SeguridadService } from '../seguridad/seguridad.service';
//import { EntradaVentaDTO } from '../billetera/billetera';
//import { Router, RouterModule } from '@angular/router';
//import { CommonModule } from '@angular/common';
//import { QRCodeModule } from 'angularx-qrcode';

//@Component({
//  selector: 'app-billetera',
//  standalone: true,
//  imports: [CommonModule, QRCodeModule, RouterModule],
//  templateUrl: './billetera.component.html',
//  styleUrls: ['./billetera.component.css']
//})
//export class BilleteraComponent implements OnInit {
//  entradasBilletera: EntradaVentaDTO[] = [];

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
//            ? URL.createObjectURL(entrada.imagenEvento)
//            : entrada.imagenEvento || 'default.jpg'
//        })) as EntradaVentaDTO[];
//      },
//      (error) => {
//        console.error('Error al cargar las entradas de la billetera:', error);
//      }
//    );
//  }

//  irAReventa(entrada: EntradaVentaDTO): void {
//    this.router.navigate([`/crear-reventa/${entrada.id}`]);
//  }

//  irAlEvento(entrada: EntradaVentaDTO): void {
//    this.router.navigate([`/comprar-entradas/${entrada.eventoId}`]);
//  }
//}



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

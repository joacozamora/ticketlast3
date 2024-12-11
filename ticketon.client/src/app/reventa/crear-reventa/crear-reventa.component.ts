import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReventaService } from '../reventa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MercadoPagoService } from '../mercado-pago.service';

@Component({
  selector: 'app-crear-reventa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-reventa.component.html',
  styleUrls: ['./crear-reventa.component.css']
})
export class CrearReventaComponent implements OnInit {
  reventaForm: FormGroup;
  entradaVentaId!: number;
  usuarioVinculado: boolean = false;

  constructor(
    private reventaService: ReventaService,
    private mercadoPagoService: MercadoPagoService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reventaForm = this.formBuilder.group({
      precioReventa: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    // Capturar el entradaVentaId desde los queryParams
    this.route.queryParams.subscribe((params) => {
      this.entradaVentaId = +params['entradaVentaId'];
      console.log('EntradaVentaId capturado:', this.entradaVentaId);
    });

    // Verificar si el usuario está vinculado con MercadoPago
    this.mercadoPagoService.verificarVinculacion().subscribe(
      () => {
        console.log('Usuario vinculado correctamente a MercadoPago.');
        this.usuarioVinculado = true;
      },
      (error: any) => {
        console.error('Usuario no vinculado con MercadoPago:', error);
        alert('Debes vincular tu cuenta de MercadoPago antes de continuar.');
        // Redirigir a la autorización con entradaVentaId
        this.mercadoPagoService.autorizarMercadoPago(this.entradaVentaId.toString());
      }
    );
  }

  crearReventa(): void {
    if (!this.entradaVentaId || isNaN(this.entradaVentaId)) {
      alert('El ID de la entrada no es válido.');
      return;
    }

    if (!this.usuarioVinculado) {
      alert('Debes vincular tu cuenta de MercadoPago antes de publicar la reventa.');
      return;
    }

    const reventaData = {
      entradaVentaId: this.entradaVentaId,
      precioReventa: this.reventaForm.value.precioReventa,
    };

    this.reventaService.crearReventa(reventaData).subscribe(
      (response) => {
        console.log('Reventa creada:', response);
        alert('¡Reventa creada con éxito!');
        // Redirigir a la página de confirmación o listado de reventas
        this.router.navigate(['/reventas']);
      },
      (error) => {
        console.error('Error al crear reventa:', error);
        alert('Error al crear la reventa.');
      }
    );
  }
}















//import { Component, OnInit } from '@angular/core';
//import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
//import { ReventaService } from '../reventa.service';

//import { ActivatedRoute, Router } from '@angular/router';
//import { CommonModule } from '@angular/common';
//import { MercadoPagoService } from '../mercado-pago.service';

//@Component({
//    selector: 'app-crear-reventa',
//    imports: [CommonModule, ReactiveFormsModule],
//    templateUrl: './crear-reventa.component.html',
//    styleUrls: ['./crear-reventa.component.css']
//})
//export class CrearReventaComponent implements OnInit {
//  reventaForm: FormGroup;
//  entradaVentaId!: number;

//  constructor(
//    private reventaService: ReventaService,
//    private mercadoPagoService: MercadoPagoService,
//    private formBuilder: FormBuilder,
//    private route: ActivatedRoute,
//    private router: Router
//  ) {
//    this.reventaForm = this.formBuilder.group({
//      precioReventa: ['', [Validators.required, Validators.min(0)]],
//    });
//  }

//  ngOnInit(): void {
//    this.route.queryParams.subscribe((params) => {
//      this.entradaVentaId = +params['entradaVentaId'];
//      console.log('EntradaVentaId capturado:', this.entradaVentaId);
//    });

//    // Verificar si el usuario está vinculado con Mercado Pago
//    this.mercadoPagoService.verificarVinculacion().subscribe(
//      () => {
//        console.log('Usuario vinculado correctamente a Mercado Pago.');
//      },
//      (error: any) => {
//        console.error('El usuario no está vinculado con Mercado Pago:', error);
//        alert('Debes vincular tu cuenta de Mercado Pago antes de continuar.');

//        // Obtén el usuarioId del contexto o del servicio de autenticación
//        const usuarioId = 'TU_LOGICA_PARA_OBTENER_EL_USUARIO_ID'; // Reemplaza con la lógica para obtener el ID del usuario

//        if (usuarioId) {
//          this.mercadoPagoService.autorizarMercadoPago(usuarioId);
//        } else {
//          console.error('No se pudo obtener el usuarioId para autorizar Mercado Pago.');
//        }
//      }
//    );
//  }


//  crearReventa(): void {
//    if (!this.entradaVentaId || isNaN(this.entradaVentaId)) {
//      alert('El ID de la entrada no es válido.');
//      return;
//    }

//    const reventaData = {
//      entradaVentaId: this.entradaVentaId,
//      precioReventa: this.reventaForm.value.precioReventa,
//    };

//    this.reventaService.crearReventa(reventaData).subscribe(
//      (response) => {
//        console.log('Reventa creada:', response);
//        alert('¡Reventa creada con éxito!');
//      },
//      (error) => {
//        console.error('Error al crear reventa:', error);
//        alert('Error al crear la reventa.');
//      }
//    );
//  }
//}

//import { Component, OnInit } from '@angular/core';
//import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
//import { ReventaService } from '../reventa.service';
//import { ActivatedRoute, Router } from '@angular/router';
//import { CommonModule } from '@angular/common';

//@Component({
//  selector: 'app-crear-reventa',
//  standalone: true,
//  imports: [CommonModule, ReactiveFormsModule],
//  templateUrl: './crear-reventa.component.html',
//  styleUrls: ['./crear-reventa.component.css']
//})
//export class CrearReventaComponent implements OnInit {
//  reventaForm: FormGroup;
//  entradaVentaId!: number;

//  constructor(
//    private reventaService: ReventaService,
//    private formBuilder: FormBuilder,
//    private route: ActivatedRoute,
//    private router: Router
//  ) {
//    // Inicializar el formulario con los campos necesarios
//    this.reventaForm = this.formBuilder.group({
//      precioReventa: ['', [Validators.required, Validators.min(0)]],
      
//    });
//  }

//  ngOnInit(): void {
//    // Obtener el entradaVentaId desde los queryParams
//    this.route.queryParams.subscribe(params => {
//      this.entradaVentaId = +params['entradaVentaId']; // Convertir a número
//      console.log('EntradaVentaId capturado:', this.entradaVentaId);
//    });
//  }

//  crearReventa(): void {
//    if (!this.entradaVentaId || isNaN(this.entradaVentaId)) {
//      alert('El ID de la entrada no es válido.');
//      return;
//    }

//    const reventaData = {
//      entradaVentaId: this.entradaVentaId,
//      precioReventa: this.reventaForm.value.precioReventa
//    };

//    this.reventaService.crearReventa(reventaData).subscribe(
//      (response) => {
//        console.log('Reventa creada:', response);
//        alert('¡Reventa creada con éxito!');
//      },
//      (error) => {
//        console.error('Error al crear reventa:', error);
//        alert('Error al crear la reventa.');
//      }
//    );
//  }
//}

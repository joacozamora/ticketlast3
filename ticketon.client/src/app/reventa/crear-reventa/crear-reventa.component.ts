import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReventaService } from '../reventa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MercadoPagoService } from '../mercado-pago.service';

@Component({
  selector: 'app-crear-reventa',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-reventa.component.html',
  styleUrls: ['./crear-reventa.component.css']
})
export class CrearReventaComponent implements OnInit {
  reventaForm: FormGroup;
  entradaVentaId!: number;

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
    this.route.queryParams.subscribe((params) => {
      this.entradaVentaId = +params['entradaVentaId'];
      console.log('EntradaVentaId capturado:', this.entradaVentaId);
    });

    // Consultar si el usuario ya tiene un registro en MercadoPago
    this.mercadoPagoService.verificarSiUsuarioExiste().subscribe(
      (response) => {
        if (response.vinculado) {
          console.log('Usuario ya está vinculado a Mercado Pago.');
          // Usuario vinculado, habilitar el formulario
        } else {
          console.warn('Usuario no está vinculado a Mercado Pago. Iniciando autorización...');
          this.mercadoPagoService.autorizarMercadoPago(this.entradaVentaId.toString());
        }
      },
      (error) => {
        console.error('Error al verificar si el usuario está vinculado:', error);
        alert('Error al verificar la vinculación. Por favor, intenta nuevamente.');
      }
    );
  }

  crearReventa(): void {
    if (!this.entradaVentaId || isNaN(this.entradaVentaId)) {
      alert('El ID de la entrada no es válido.');
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
        this.router.navigate(['/reventas']); // Redirige a la lista de reventas o donde corresponda
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

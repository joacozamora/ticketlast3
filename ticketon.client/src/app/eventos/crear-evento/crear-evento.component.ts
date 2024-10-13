import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoCreacionDTO } from '../evento';
import { FormularioEventoComponent } from '../formulario-evento/formulario-evento.component';
import { CommonModule } from '@angular/common'; // Si es necesario para otros elementos
import { RouterModule } from '@angular/router'; // Si estás usando enrutamiento en este componente
import { EventosService } from '../eventos.service';




@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [CommonModule, RouterModule, FormularioEventoComponent],  // Importas el componente standalone
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent {
  router = inject(Router);  // Usamos inject para el Router
  eventosServices = inject(EventosService);
  route = inject(ActivatedRoute);

  idUsuario!: string;

  //ngOnInit(): void {
  //  this.route.params.subscribe(params => {
  //    this.idUsuario=params['']
  //  })
  //}
  /*constructor(private eventoServices: EventosService) { }*/

  guardarCambios(evento: EventoCreacionDTO) {
    this.eventosServices.crear(evento).subscribe({
      next: evento => {
        console.log(evento);
        this.router.navigate(['/entradas/crear', evento.id]);
      },
      //error: err => {
      //  const errores = extraerErrores(err);
      //  this.errores = errores;
      //}
    })
  }
}

//import { Component, inject } from '@angular/core';
//import { Router } from '@angular/router';
//import { EventoCreacionDTO } from '../evento';
//import { EventosService } from '../eventos.service';
//import { SeguridadService } from '../../seguridad/seguridad.service';
//import { FormularioEventoComponent } from '../formulario-evento/formulario-evento.component';

//@Component({
//  selector: 'app-crear-evento',
//  standalone: true,
//  imports: [FormularioEventoComponent],
//  templateUrl: './crear-evento.component.html',
//  styleUrls: ['./crear-evento.component.css']
//})
//export class CrearEventoComponent {
//  router = inject(Router);
//  eventosServices = inject(EventosService);
//  seguridadService = inject(SeguridadService);  // Inyectamos el servicio de seguridad

//  guardarCambios(evento: EventoCreacionDTO) {
//    const idUsuario = this.seguridadService.obtenerIdUsuario(); // Obtenemos el ID del usuario

//    if (idUsuario) {
//      // Incluimos el ID del usuario en el evento (si es necesario)
//      evento.idUsuario = idUsuario;  // Asegúrate de que el DTO soporte esta propiedad

//      this.eventosServices.crear(evento).subscribe({
//        next: (eventoCreado) => {
//          console.log(eventoCreado);
//          this.router.navigate(['/entradas/crear', eventoCreado.id]);
//        },
//        error: (err) => {
//          console.error('Error al crear el evento', err);
//        },
//      });
//    } else {
//      console.error('No se encontró el ID del usuario');
//    }
//  }
//}


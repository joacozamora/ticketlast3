import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { EventoCreacionDTO, EventoDTO } from '../evento';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputImgComponent } from '../../utilidades/input-img/input-img.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import moment from 'moment';
import { MapaComponent } from '../../utilidades/mapa/mapa.component';
import { Coordenada } from '../../utilidades/mapa/Coordenada';

@Component({
  selector: 'app-formulario-evento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    InputImgComponent,
    MapaComponent,
  ],
  templateUrl: './formulario-evento.component.html',
  styleUrls: ['./formulario-evento.component.css']
})
export class FormularioEventoComponent implements OnInit {
  @Input()
  modelo?: EventoDTO;

  @Input()
  urlImagenActual?: string;

  @Output()
  posteoFormulario = new EventEmitter<EventoCreacionDTO>();

  coordenadasIniciales: Coordenada[] = [];

  private formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    nombre: ['', Validators.required],
    direccion: ['', Validators.required],
    nombreLugar: ['', Validators.required],
    latitud: new FormControl<number | null>(null, Validators.required),
    longitud: new FormControl<number | null>(null, Validators.required),
    fechaInicio: new FormControl<Date | null>(null, Validators.required),
    imagen: new FormControl<File | undefined>(undefined),
    esPublicitado: [false],
    activo: [true],
  });

  ngOnInit(): void {
    if (this.modelo) {
      this.coordenadasIniciales = [{
        latitud: this.modelo.latitud ?? 0,
        longitud: this.modelo.longitud ?? 0,
      }];

      if (this.modelo.imagen?.trim()) {
        this.urlImagenActual = this.modelo.imagen;
      }

      this.form.patchValue({
        ...this.modelo,
        imagen: null,
        activo: this.modelo.activo,
      });
    }
  }

  archivoSeleccionado(archivo: File) {
    this.form.controls.imagen.setValue(archivo);
  }

  guardarCambios() {
    if (!this.form.valid) {
      console.warn('Formulario inválido:', this.form.errors);
      return;
    }

    const evento: EventoCreacionDTO = {
      nombre: this.form.get('nombre')!.value!,
      direccion: this.form.get('direccion')!.value!,
      nombreLugar: this.form.get('nombreLugar')!.value!,
      latitud: this.form.get('latitud')!.value!,
      longitud: this.form.get('longitud')!.value!,
      fechaInicio: moment(this.form.get('fechaInicio')!.value).toDate(),
      imagen: this.form.get('imagen')!.value || undefined,
      esPublicitado: this.form.get('esPublicitado')!.value!,
      activo: this.form.get('activo')!.value!,
    };

    this.posteoFormulario.emit(evento);
  }

  coordenadaSeleccionada(coordenada: Coordenada) {
    this.form.patchValue({
      latitud: coordenada.latitud,
      longitud: coordenada.longitud,
    });
  }
}



//import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
//import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
//import { EventoCreacionDTO, EventoDTO } from '../evento';
//import { EventosService } from '../eventos.service';
//import { MatDatepickerModule } from '@angular/material/datepicker';
//import { MatInputModule } from '@angular/material/input';
//import { MatMomentDateModule } from '@angular/material-moment-adapter';
//import { CommonModule } from '@angular/common';
//import { MatFormFieldModule } from '@angular/material/form-field';
//import { InputImgComponent } from '../../utilidades/input-img/input-img.component';
//import { MatButtonModule } from '@angular/material/button';
//import moment from 'moment';
//import { MapaComponent } from '../../utilidades/mapa/mapa.component';
//import { Coordenada } from '../../utilidades/mapa/Coordenada';

//@Component({
//    selector: 'app-formulario-evento',
//    imports: [
//        CommonModule,
//        ReactiveFormsModule,
//        MatInputModule,
//        MatDatepickerModule,
//        MatMomentDateModule,
//        MatButtonModule,
//        MatFormFieldModule,
//        InputImgComponent,
//        MapaComponent,
//    ],
//    templateUrl: './formulario-evento.component.html',
//    styleUrls: ['./formulario-evento.component.css']
//})
//export class FormularioEventoComponent implements OnInit {

//  urlImagenActual?: string;

//  ngOnInit(): void {
//    if (this.modelo) {
//      // Validar si la latitud y longitud son números válidos
//      if (
//        typeof this.modelo.latitud === 'number' &&
//        typeof this.modelo.longitud === 'number'
//      ) {
//        this.coordenadasIniciales.push({
//          latitud: this.modelo.latitud,
//          longitud: this.modelo.longitud,
//        });
//      } else {
//        console.error('Latitud o longitud inválidas:', {
//          latitud: this.modelo.latitud,
//          longitud: this.modelo.longitud,
//        });
//      }

//      // Validar y asignar la URL de la imagen actual
//      if (typeof this.modelo.imagen === 'string' && this.modelo.imagen.trim() !== '') {
//        this.urlImagenActual = this.modelo.imagen;
//      } else {
//        console.warn('No se encontró una URL de imagen válida.');
//        this.urlImagenActual = undefined; // Opcional: Limpia el valor si no es válido
//      }

//      // Asignar los valores al formulario
//      this.form.patchValue({
//        ...this.modelo,
//        imagen: typeof this.modelo.imagen === 'string' ? null : this.modelo.imagen,
//      });
//    }
//  }

//  coordenadasIniciales: Coordenada[] = [];

//  @Input()
//  modelo?: EventoDTO;

//  @Output()
//  posteoFormulario = new EventEmitter<EventoCreacionDTO>();

//  private formBuilder = inject(FormBuilder);
//  form = this.formBuilder.group({
//    nombre: ['', { validators: [Validators.required] }],
//    latitud: new FormControl<number | null>(null, [Validators.required]),
//    longitud: new FormControl<number | null>(null, [Validators.required]),
//    fechaInicio: new FormControl<Date | null>(null, { validators: [Validators.required] }),
//    imagen: new FormControl<File | undefined>(undefined),
//  });

//  archivoSeleccionado(archivo: File) {
//    this.form.controls.imagen.setValue(archivo);
//    console.log('Archivo seleccionado:', archivo.name); // Para depuración
//  }

//  guardarCambios() {
//    if (!this.form.valid) {
//      console.warn('Formulario inválido:', this.form.errors);
//      return;
//    }

//    const evento: EventoCreacionDTO = {
//      nombre: this.form.controls.nombre.value!,
//      latitud: this.form.controls.latitud.value!, // Redondea a 8 decimales
//      longitud: this.form.controls.longitud.value!, // Redondea a 8 decimales
//      fechaInicio: moment(this.form.controls.fechaInicio.value).toDate(),
//      imagen: this.form.controls.imagen.value || undefined,
//    };

//    console.log('Evento listo para enviar:', evento); // Depuración
//    this.posteoFormulario.emit(evento);
//  }


//  coordenadaSeleccionada(coordenada: Coordenada) {
//    this.form.patchValue({
//      latitud: coordenada.latitud,
//      longitud: coordenada.longitud,
//    });
//  }
//}



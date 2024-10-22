import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { EventoCreacionDTO, EventoDTO } from '../evento';
import { EventosService } from '../eventos.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
/*import { MatNativeDateModule } from '@angular/material/core'; // Si usas fechas nativas*/
import { MatMomentDateModule } from '@angular/material-moment-adapter'; // Si usas Moment.js
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field'; // Campo de formulario
import { InputImgComponent } from '../../utilidades/input-img/input-img.component';
import { MatButtonModule } from '@angular/material/button';
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
    /*MatNativeDateModule,*/
    MatFormFieldModule,
    InputImgComponent,
    MapaComponent,

  ],
  templateUrl: './formulario-evento.component.html',
  styleUrls: ['./formulario-evento.component.css']
})
export class FormularioEventoComponent implements OnInit {


  ngOnInit(): void {
    if (this.modelo !== undefined) {
      this.form.patchValue(this.modelo);
      this.coordenadasIniciales.push({ latitud: this.modelo.latitud, longitud: this.modelo.longitud })
    }
  }

  coordenadasIniciales: Coordenada[] = [];

  @Input()
  modelo?: EventoDTO;

  @Output()
  posteoFormulario = new EventEmitter<EventoCreacionDTO>();

  private formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    nombre: ['', { validators: [Validators.required] }],
    latitud: new FormControl<number | null>(null, [Validators.required]),
    longitud: new FormControl<number | null>(null, [Validators.required]),
    fechaInicio: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    imagen: new FormControl<File | string | null>(null)
  });


  archivoSeleccionado(archivo: File) {
    this.form.controls.imagen.setValue(archivo);
  }

  guardarCambios() {
    
    if (!this.form.valid) {
      return;
    }

    const evento = {
      ...this.form.value as EventoCreacionDTO,
    };


    // Verificar si los valores de latitud y longitud est�n presentes
    if (this.form.controls.latitud.value === null || this.form.controls.longitud.value === null) {
      console.error("Latitud y longitud no est�n definidas");
      return;
    }

    evento.fechaInicio = moment(evento.fechaInicio).toDate();

    console.log("Evento a guardar:", evento); // Para debug
    this.posteoFormulario.emit(evento);
  }


  coordenadaSeleccionada(coordenada: Coordenada) {
    this.form.patchValue({
      latitud: coordenada.latitud,
      longitud: coordenada.longitud
    });
  }


}

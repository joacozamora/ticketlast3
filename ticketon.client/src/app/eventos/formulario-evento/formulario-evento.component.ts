import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { EventoCreacionDTO } from '../evento';
import { EventosService } from '../eventos.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
/*import { MatNativeDateModule } from '@angular/material/core'; // Si usas fechas nativas*/
import { MatMomentDateModule } from '@angular/material-moment-adapter'; // Si usas Moment.js
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field'; // Campo de formulario
import { InputImgComponent } from '../../utilidades/input-img/input-img.component';

@Component({
  selector: 'app-formulario-evento',
  standalone: true, // Marcamos este componente como standalone
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    /*MatNativeDateModule, // O MatMomentDateModule si usas Moment.js*/
    MatFormFieldModule,
    InputImgComponent
  ],
  templateUrl: './formulario-evento.component.html',
  styleUrls: ['./formulario-evento.component.css']
})
export class FormularioEventoComponent {
  form!: FormGroup;

  @Output()
  onSubmit: EventEmitter<EventoCreacionDTO> = new EventEmitter<EventoCreacionDTO>();

  constructor(private formBuilder: FormBuilder, private eventoServicio: EventosService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      fechaEvento: [null, Validators.required], // Campo de fecha
      poster: new FormControl<File | null>(null)
    });
  }

  archivoSeleccionado(archivo: File) {
    this.form.controls['poster'].setValue(archivo);
  }

  guardarCambios() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value); // Emitimos el valor del formulario
      this.eventoServicio.createEvento(this.form.value).subscribe(response => {
        console.log('Evento guardado', response);
      });
    }
  }

}





//import { Component, EventEmitter, Output } from '@angular/core';
//import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
//import { EventoCreacionDTO } from '../evento';
//import { EventosService } from '../eventos.service';
//import { MatDatepickerModule } from '@angular/material/datepicker';
//import { MatInputModule } from '@angular/material/input';
//import { MatNativeDateModule } from '@angular/material/core'; // Si usas fechas nativas
//import { MatMomentDateModule } from '@angular/material-moment-adapter'; // Si usas Moment.js



//@Component({
//  selector: 'app-formulario-evento',
//  templateUrl: './formulario-evento.component.html',
//  styleUrls: ['./formulario-evento.component.css']
//})
//export class FormularioEventoComponent{

//  constructor(private formBuilder: FormBuilder, private eventoServicio: EventosService) { }
//  form!: FormGroup;

//  @Output()
//  OnSubmit: EventEmitter<EventoCreacionDTO> = new EventEmitter<EventoCreacionDTO>();

//  ngOnInit(): void {
//    this.form = this.formBuilder.group({
//      nombre: [
//        '',
//        {
//          validators: [Validators.required]
//        }
//      ],     
//      poster: new FormControl<File| null>(null)
//    });
//  }

//  archivoSeleccionado(archivo: File) {
//    this.form.controls['poster'].setValue(archivo);
//  }
//  onSubmit(): void {
//    if (this.form.valid) {
//      this.eventoServicio.createEvento(this.form.value).subscribe(response => {
//        console.log('Evento guardado', response);
//      });
//    }
//  }

//  guardarCambios() {
//    if (this.form.valid) {
//      this.eventoServicio.createEvento(this.form.value).subscribe(response => {
//        console.log('Evento guardado', response);
//      });
//    }
//  }

//}

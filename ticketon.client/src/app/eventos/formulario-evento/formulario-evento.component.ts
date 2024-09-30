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
import { MatButtonModule } from '@angular/material/button';

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
      fechaInicio: [null, Validators.required], // Campo de fecha
      /*imagen: new FormControl<File | null>(null)*/
    });
  }

  archivoSeleccionado(archivo: File) {
    this.form.controls['imagen'].setValue(archivo);
  }

  guardarCambios() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value); // Emitimos el valor del formulario
      this.eventoServicio.crear(this.form.value).subscribe(response => {
        console.log('Evento guardado', response);
      });
    }
  }

}

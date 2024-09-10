import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { EventoCreacionDTO } from '../evento';

@Component({
  selector: 'app-formulario-evento',
  templateUrl: './formulario-evento.component.html',
  styleUrls: ['./formulario-evento.component.css']
})
export class FormularioEventoComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }
  form!: FormGroup;

  @Output()
  OnSubmit: EventEmitter<EventoCreacionDTO> = new EventEmitter<EventoCreacionDTO>();

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: [
        '',
        {
          validators: [Validators.required]
        }
      ],
      fechaInicio: '',
      poster: ''
    });
  }

  //archivoSeleccionado(archivo: File) {
  //  this.form?.get('poster')?.setValue(archivo);

  /* /<!--[urlImagenActual]="modelo?.foto"(archivoSeleccionado) = "archivoSeleccionado($event)"-- >/*/
  //}

  guardarCambios() {
    this.OnSubmit.emit(this.form?.value)
  }

}

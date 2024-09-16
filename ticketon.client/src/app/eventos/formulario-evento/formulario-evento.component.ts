import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { EventoCreacionDTO } from '../evento';
import { EventosService } from '../eventos.service';


@Component({
  selector: 'app-formulario-evento',
  templateUrl: './formulario-evento.component.html',
  styleUrls: ['./formulario-evento.component.css']
})
export class FormularioEventoComponent{

  constructor(private formBuilder: FormBuilder, private eventoServicio: EventosService) { }
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
  onSubmit(): void {
    if (this.form.valid) {
      this.eventoServicio.createEvento(this.form.value).subscribe(response => {
        console.log('Evento guardado', response);
      });
    }
  }

  guardarCambios() {
    if (this.form.valid) {
      this.eventoServicio.createEvento(this.form.value).subscribe(response => {
        console.log('Evento guardado', response);
      });
    }
  }

}

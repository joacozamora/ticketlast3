import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { generoCreacionDTO } from '../genero';

@Component({
  selector: 'app-formulario-genero',
  templateUrl: './formulario-genero.component.html',
  styleUrls: ['./formulario-genero.component.css']
})
export class FormularioGeneroComponent {

  constructor(private formBuilder: FormBuilder) { }
  form!: FormGroup;

  @Output()
  onSubmit: EventEmitter<generoCreacionDTO> = new EventEmitter<generoCreacionDTO>();

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  guardarCambios() {
    this.onSubmit.emit(this.form.value);
  }

  obtenerErrorCampoNombre() {
    var campo = this.form.get('nombre');
    console.log('Errores del campo nombre:', campo?.errors);

    if (campo?.hasError('required')) {
      return 'El campo nombre es requerido';
    }

    if (campo?.hasError('minLength')) {
      console.log('Error: Longitud mínima');
      return 'El campo debe contener al menos 3 caracteres';

    }
    console.log('No hay errores');
    return '';
  }
}

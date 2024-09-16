import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { GeneroCreacionDTO } from '../genero';
import { GenerosService } from '../generos.service';


@Component({
  selector: 'app-formulario-genero',
  templateUrl: './formulario-genero.component.html',
  styleUrls: ['./formulario-genero.component.css']
})
export class FormularioGeneroComponent {

  constructor(private formBuilder: FormBuilder, private generoServicio: GenerosService) { }
  form!: FormGroup;

  @Output()
  onSubmit: EventEmitter<GeneroCreacionDTO> = new EventEmitter<GeneroCreacionDTO>();

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  guardarCambios() {
    if (this.form.valid) {
      this.generoServicio.createGenero(this.form.value).subscribe(response => {
        console.log('Genero guardado', response);
      });
    }
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

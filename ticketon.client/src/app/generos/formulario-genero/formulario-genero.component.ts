import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { GeneroCreacionDTO } from '../genero';
import { GenerosService } from '../generos.service';
import { primeraLetraMayuscula } from '../../utilidades/funciones/validaciones';


@Component({
  selector: 'app-formulario-genero',
  templateUrl: './formulario-genero.component.html',
  styleUrls: ['./formulario-genero.component.css']
})
export class FormularioGeneroComponent {

  constructor(private formBuilder: FormBuilder, private generoServicio: GenerosService) { }
  form!: FormGroup;

  @Input()
  modelo: GeneroCreacionDTO | undefined;

  @Output()
  onSubmit: EventEmitter<GeneroCreacionDTO> = new EventEmitter<GeneroCreacionDTO>();

  ngOnInit(): void {
    // Inicializa el formulario, prellenando el nombre si se está editando
    this.form = this.formBuilder.group({
      nombre: ['', { validators: [Validators.required, primeraLetraMayuscula(), Validators.maxLength(50)] }]
    });

   
  }

  guardarCambios() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);  // Emitimos el valor del formulario
    }
  }

  
  obtenerErrorCampoNombre(): string {
    let nombre = this.form.controls['nombre'];

    if (nombre.hasError('required')) {
      return "El campo nombre es requerido";
    }

    if (nombre.hasError('maxlength')) {
      return `El campo nombre no puede tener más de ${nombre.getError('maxlength').requiredLength} caracteres`;
    }

    if (nombre.hasError('primeraLetraMayuscula')) {
      return nombre.getError('primeraLetraMayuscula').mensaje;
    }

    return "";

  }
}

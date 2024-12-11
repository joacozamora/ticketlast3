
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Entrada } from '../entradas';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { EntradasService } from '../entradas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EventosService } from '../../eventos/eventos.service';

@Component({
  selector: 'app-formulario-entrada',
  imports: [CommonModule, MatFormField, MatLabel, MatError, ReactiveFormsModule],
  templateUrl: './formulario-entrada.component.html',
  styleUrls: ['./formulario-entrada.component.css']
})
export class FormularioEntradaComponent implements OnInit {
  @Input() idEvento!: number;
  evento: any; // Define la propiedad evento para almacenar los datos del evento

  private formBuilder = inject(FormBuilder);
  private entradasService = inject(EntradasService);
  private router = inject(Router);
  private eventoService = inject(EventosService);
  private route = inject(ActivatedRoute);

  form: FormGroup = this.formBuilder.group({
    entradas: this.formBuilder.array([this.crearEntrada()])
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const eventoId = +params['id'];
      if (eventoId > 0) {
        this.idEvento = eventoId;
        this.cargarEvento(eventoId);
      }
    });
  }

  get entradas(): FormArray {
    return this.form.get('entradas') as FormArray;
  }

  crearEntrada(): FormGroup {
    return this.formBuilder.group({
      nombreTanda: ['', Validators.required],
      stock: [null, [Validators.required, Validators.min(1)]],
      precio: [null, [Validators.required, Validators.min(0)]],
    });
  }

  cargarEvento(eventoId: number): void {
    this.eventoService.obtenerPorId(eventoId).subscribe(
      evento => {
        this.evento = evento; // Asigna los datos del evento a la propiedad evento
      },
      error => {
        console.error('Error al cargar el evento:', error);
      }
    );
  }

  agregarEntrada(): void {
    this.entradas.push(this.crearEntrada());
  }

  eliminarEntrada(index: number): void {
    this.entradas.removeAt(index);
  }

  guardarCambios() {
    if (this.form.invalid) return;

    const entradas = this.entradas.value.map((entrada: any) => ({
      nombreTanda: entrada.nombreTanda,
      stock: entrada.stock,
      precio: entrada.precio,
      idEvento: this.idEvento, // Se envía el ID del evento
      correoOrganizador: "" // Se envía vacío para que el backend lo maneje
    }));

    console.log('Entradas enviadas:', entradas);

    this.entradasService.crear(entradas).subscribe({
      next: () => {
        this.router.navigate(['/eventos']); // Redirige a la página de eventos
      },
      error: (error) => {
        console.error('Error al guardar las entradas:', error);
        alert('Ocurrió un error al guardar las entradas.');
      }
    });
  }
}


//  guardarCambios() {
//    if (this.form.invalid) return;

//    const entradas = this.entradas.value.map((entrada: any) => ({
//      nombreTanda: entrada.nombreTanda,
//      stock: entrada.stock,
//      precio: entrada.precio,
//      idEvento: this.idEvento  // Asegúrate de que idEvento es un valor válido y obligatorio
//    }));

//    console.log("Datos enviados:", entradas);  // Confirma que los datos son correctos

//    this.entradasService.crear(entradas).subscribe({
//      next: () => {
//        this.router.navigate(['/eventos']);
//      },
//      error: (error) => {
//        console.log("Error al guardar las entradas: ", error);
//      }
//    });
//  }
//}



//export class FormularioEntradaComponent {

//  private formBuilder = inject(FormBuilder);

//  @Input()
//  modelo?: Entrada;

//  @Output()
//  posteoFormulario = new EventEmitter<Entrada>();

//  form: FormGroup = this.formBuilder.group({
//    nombreTanda: ['', Validators.required],
//    stock: [0, [Validators.required, Validators.min(1)]],
//    precio: [0, [Validators.required, Validators.min(0.01)]]
//  });

//  ngOnInit(): void {
//    if (this.modelo !== undefined) {
//      this.form.patchValue(this.modelo);
//    }
//  }

//  guardarCambios() {
//    if (this.form.valid) {
//      this.posteoFormulario.emit(this.form.value);
//    }
//  }
//}

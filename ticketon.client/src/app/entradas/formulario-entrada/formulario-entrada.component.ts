//import { Component } from '@angular/core';

//@Component({
//  selector: 'app-formulario-entrada',
//  templateUrl: './formulario-entrada.component.html',
//  styleUrl: './formulario-entrada.component.css'
//})
//export class FormularioEntradaComponent {

//}

import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Entrada } from '../entradas';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { EntradasService } from '../entradas.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-formulario-entrada',
  standalone: true,
  imports: [CommonModule, MatFormField, MatLabel, MatError, ReactiveFormsModule],
  templateUrl: './formulario-entrada.component.html',
  styleUrls: ['./formulario-entrada.component.css']
})
export class FormularioEntradaComponent implements OnInit {
  @Input() idEvento!: number; 
  private formBuilder = inject(FormBuilder);
  private entradasService = inject(EntradasService);
  private router = inject(Router);  

  form: FormGroup = this.formBuilder.group({
    nombreTanda: ['', Validators.required],
    stock: [null, [Validators.required, Validators.min(1)]],
    precio: [null, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void { }

  guardarCambios() {
    if (this.form.invalid) return;

    const entrada = {
      ...this.form.value,
      idEvento: this.idEvento  
    };

    
    this.entradasService.crear(entrada).subscribe({
      next: () => {
       
        this.router.navigate(['/eventos']);  
      },
      error: (error) => {
        console.log("Error al guardar la entrada: ", error);
      }
    });
  }
}

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

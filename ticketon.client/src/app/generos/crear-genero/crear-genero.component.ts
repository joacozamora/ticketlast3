import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneroCreacionDTO } from '../genero';
import { GenerosService } from '../generos.service';
import { FormularioGeneroComponent } from '../formulario-genero/formulario-genero.component';


@Component({
  selector: 'app-crear-genero',
  standalone: true,
  imports: [FormularioGeneroComponent], 
  templateUrl: './crear-genero.component.html',
  styleUrls: ['./crear-genero.component.css']
})
export class CrearGeneroComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private generosServices: GenerosService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  guardarCambios(genero: GeneroCreacionDTO) {
    this.generosServices.crear(genero).subscribe(() => {
      this.router.navigate(['/generos']);
    });
  }
}

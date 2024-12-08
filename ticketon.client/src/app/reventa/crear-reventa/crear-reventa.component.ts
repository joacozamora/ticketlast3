import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReventaService } from '../reventa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-reventa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-reventa.component.html',
  styleUrls: ['./crear-reventa.component.css']
})
export class CrearReventaComponent implements OnInit {
  reventaForm: FormGroup;
  entradaVentaId!: number;

  constructor(
    private reventaService: ReventaService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Inicializar el formulario con los campos necesarios
    this.reventaForm = this.formBuilder.group({
      precioReventa: ['', [Validators.required, Validators.min(0)]],
      
    });
  }

  ngOnInit(): void {
    // Obtener el entradaVentaId desde los queryParams
    this.route.queryParams.subscribe(params => {
      this.entradaVentaId = +params['entradaVentaId']; // Convertir a número
      console.log('EntradaVentaId capturado:', this.entradaVentaId);
    });
  }

  crearReventa(): void {
    if (!this.entradaVentaId || isNaN(this.entradaVentaId)) {
      alert('El ID de la entrada no es válido.');
      return;
    }

    const reventaData = {
      entradaVentaId: this.entradaVentaId,
      precioReventa: this.reventaForm.value.precioReventa
    };

    this.reventaService.crearReventa(reventaData).subscribe(
      (response) => {
        console.log('Reventa creada:', response);
        alert('¡Reventa creada con éxito!');
      },
      (error) => {
        console.error('Error al crear reventa:', error);
        alert('Error al crear la reventa.');
      }
    );
  }
}

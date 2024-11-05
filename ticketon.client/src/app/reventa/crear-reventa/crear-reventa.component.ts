import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReventaService } from '../reventa.service';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute
  ) {
    // Inicializar el formulario con los campos necesarios
    this.reventaForm = this.formBuilder.group({
      precioReventa: ['', [Validators.required, Validators.min(0)]],
      accessToken: ['', Validators.required] // Campo para el access token
    });
  }

  ngOnInit(): void {
    // Obtener el entradaVentaId desde los queryParams
    this.route.queryParams.subscribe(params => {
      this.entradaVentaId = +params['entradaVentaId']; // Convertir a número
    });
  }

  crearReventa(): void {
    const reventaData = {
      entradaVentaId: this.entradaVentaId,
      precioReventa: this.reventaForm.value.precioReventa,
      accessToken: this.reventaForm.value.accessToken
    };

    this.reventaService.crearReventa(reventaData).subscribe(
      (response) => {
        console.log('Reventa creada:', response);
        // Aquí podrías redirigir a la lista de reventas o mostrar un mensaje de éxito
      },
      (error) => {
        console.error('Error al crear reventa:', error);
      }
    );
  }
}

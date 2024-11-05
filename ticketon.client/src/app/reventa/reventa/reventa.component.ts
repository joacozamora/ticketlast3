import { Component, OnInit } from '@angular/core';
import { ReventaService } from '../reventa.service';
import { ReventaDTO } from '../reventa';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reventa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reventa.component.html',
  styleUrls: ['./reventa.component.css']
})
export class ReventaComponent implements OnInit {
  reventas: ReventaDTO[] = [];

  constructor(private reventaService: ReventaService) { }

  ngOnInit(): void {
    this.cargarReventas();
  }

  cargarReventas(): void {
    this.reventaService.obtenerReventas().subscribe(
      (data: ReventaDTO[]) => {
        this.reventas = data;
      },
      (error) => {
        console.error('Error al cargar las reventas:', error);
      }
    );
  }
}

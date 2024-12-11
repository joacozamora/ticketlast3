import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReventaService } from '../reventa/reventa.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirmacion-reventa',
    imports: [CommonModule],
    templateUrl: './confirmacion-reventa.component.html',
    styleUrls: ['./confirmacion-reventa.component.css']
})
export class ConfirmacionReventaComponent implements OnInit {
  reventaId!: number;
  isProcessing: boolean = true;
  isSuccess: boolean | null = null;

  constructor(private route: ActivatedRoute, private reventaService: ReventaService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.reventaId = +params['reventaId'];
      if (this.reventaId) {
        this.confirmarReventa();
      } else {
        console.error('No se proporcionó reventaId en la URL.');
        this.isProcessing = false;
        this.isSuccess = false;
      }
    });
  }

  confirmarReventa(): void {
    this.reventaService.confirmarReventa(this.reventaId).subscribe(
      () => {
        this.isProcessing = false;
        this.isSuccess = true;
      },
      (error) => {
        console.error('Error al confirmar la reventa:', error);
        this.isProcessing = false;
        this.isSuccess = false;
      }
    );
  }
}

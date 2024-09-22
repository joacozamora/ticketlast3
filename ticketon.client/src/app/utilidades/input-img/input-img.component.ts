import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-img',
  templateUrl: './input-img.component.html',
  styleUrls: ['./input-img.component.css']
})
export class InputImgComponent {

  @Input({ required: true })
  titulo!: string;


  imagenBase64?: string;

  @Output()
  archivoSeleccionado = new EventEmitter<File>();


  cambio(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      this.toBase64(file).then((value: string) => this.imagenBase64 = value);
      this.archivoSeleccionado.emit(file);
    }
  }

  private toBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const lector = new FileReader();
      lector.readAsDataURL(file);
      lector.onload = () => resolve(lector.result as string);
      lector.onerror = error => reject(error);
    });
  }
}

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-input-img',
  templateUrl: './input-img.component.html',
  styleUrl: './input-img.component.css'
})
export class InputImgComponent {

  imagenBase64: string | undefined;

  @Output()
  archivoSeleccionado: EventEmitter<File> = new EventEmitter<File>();


  change(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file: File = target.files[0];
      this.toBase64(file).then((value: string) => this.imagenBase64 = value);
      this.archivoSeleccionado.emit(file);
    }
  }

  private toBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarruselComponent {
  @Input() eventos: { nombre: string; imagen: string }[] = [];


  ngAfterViewInit() {
    const swiperElement = document.querySelector('.mySwiper') as any;

    if (swiperElement && swiperElement.swiper) {
      swiperElement.swiper.params.autoplay = {
        delay: 3000,
        disableOnInteraction: false,
      };
      swiperElement.swiper.autoplay.start();
    }
  }
}


//  ngAfterViewInit() {
//    const swiper = document.querySelector('.mySwiper') as any;

//    if (swiper && swiper.swiper) {
//      swiper.swiper.params.autoplay = {
//        delay: 3000,
//        disableOnInteraction: false,
//      };
//      swiper.swiper.autoplay.start();

//      // Reactivar autoplay después de interacción en los puntos de paginación
//      swiper.swiper.pagination.bullets.forEach((bullet: HTMLElement, index: number) => {
//        bullet.addEventListener('click', () => {
//          swiper.swiper.slideTo(index);
//          swiper.swiper.autoplay.start(); // Reiniciar autoplay después de la interacción
//        });
//      });
//    }
//  }
//}

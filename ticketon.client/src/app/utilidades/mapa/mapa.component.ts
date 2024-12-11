import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { LeafletMouseEvent, Marker, MarkerOptions, icon, latLng, marker, tileLayer } from 'leaflet';
import { Coordenada } from './Coordenada';

@Component({
    selector: 'app-mapa',
    imports: [LeafletModule],
    templateUrl: './mapa.component.html',
    styleUrl: './mapa.component.css'
})
export class MapaComponent implements OnInit {

  ngOnInit(): void {
    this.capas = this.coordenadasIniciales.map(valor => {
      const marcador = marker([valor.latitud, valor.longitud], this.markerOptions);

      if (valor.texto) {
        marcador.bindPopup(valor.texto, { autoClose: false, autoPan: false });
      }

      return marcador;
    });
  }

  @Input()
  soloLectura = false;

  @Input()
  coordenadasIniciales: Coordenada[] = [];

  @Output()
  coordenadaSeleccionada = new EventEmitter<Coordenada>();

  markerOptions: MarkerOptions = {
    icon: icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png'
    })
  }

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...'
      })
    ],
    zoom: 14,
    center: latLng(-31.420152460481088, -64.18884635610026)
  }

  capas: Marker<any>[] = [];

  manejarClick(event: LeafletMouseEvent) {

    if (this.soloLectura) {
      return;
    }

    const latitud = event.latlng.lat;
    const longitud = event.latlng.lng;

    this.capas = [];
    this.capas.push(marker([latitud, longitud], this.markerOptions));
    this.coordenadaSeleccionada.emit({ latitud, longitud })
  }
}

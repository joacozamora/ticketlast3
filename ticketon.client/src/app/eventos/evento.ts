export interface EventoCreacionDTO {
  nombre: string;
  direccion?: string;
  nombreLugar?: string;
  fechaInicio: Date;
  latitud: number;
  longitud: number;
  esPublicitado?: boolean;
  activo?: boolean;
  imagen?: File;
}

export interface EventoDTO {
  id: number;
  nombre: string;
  fechaInicio: Date;
  imagen?: string;
  latitud: number;
  longitud: number;
  direccion: string;
  nombreLugar: string;
  esPublicitado: boolean;
  activo: boolean;
}
export interface LandingPageDTO {
  publicados: EventoDTO[];
}

export interface EventosPageDTO {
  creados: EventoDTO[];
}

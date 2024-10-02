export interface EventoCreacionDTO {
  nombre: string;
  latitud: number;
  longitud: number;
  fechaInicio: Date;
  imagen?: File;
}

export interface EventoDTO {
  id: number;
  nombre: string;
  latitud: number;
  longitud: number;
  fechaInicio: Date;
  imagen?: string;
}
export interface LandingPageDTO {
  publicados: EventoDTO[];
}

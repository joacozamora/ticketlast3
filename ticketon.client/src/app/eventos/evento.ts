export interface EventoCreacionDTO {
  nombre: string;
  fechaInicio: Date;
  imagen?: File;
  latitud: number;
  longitud: number;
  
}

export interface EventoDTO {
  id: number;
  nombre: string;
  fechaInicio: Date;
  imagen?: string;
  latitud: number;
  longitud: number;
  
}
export interface LandingPageDTO {
  publicados: EventoDTO[];
}

export interface EventoCreacionDTO {
  nombre: string;
  fechaInicio: Date;
  imagen?: File;
}

export interface EventoDTO {
  id: number;
  nombre: string;
  fechaInicio: Date;
  imagen?: string;
}
export interface LandingPageDTO {
  publicados: EventoDTO[];
}

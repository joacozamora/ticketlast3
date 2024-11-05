export interface Reventa {
  id: number;             // ID de la reventa
  entradaVentaId: number; // ID de la entrada que se está revendiendo
  precioReventa: number;  // Precio de reventa
  usuarioId: string;      // ID del usuario que está revendiendo
  fechaPublicacion?: Date; // Fecha de publicación (opcional)
}

export interface ReventaCreacionDTO {
  entradaVentaId: number; // ID de la entrada a revender
  precioReventa: number;   // Precio por el que se revende
  usuarioId?: string;       // ID del usuario que está revendiendo
}

export interface ReventaDTO {
  id: number;
  entradaId: number;
  precioReventa: number;  // Precio de reventa
  usuarioId: string;      // ID del usuario que realizó la reventa
  nombreEvento: string;   // Nombre del evento
  imagenEvento: string;   // URL de la imagen del evento
  fechaPublicacion: Date; // Fecha de publicación de la reventa
}


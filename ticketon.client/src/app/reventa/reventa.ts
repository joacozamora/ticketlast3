export interface Reventa {
  id: number;
  entradaVentaId: number;
  precioReventa: number;
  usuarioId: string;
  estado: string; // Estado de la reventa (Disponible, Vendida, Cancelada)
  compradorId?: string; // ID del comprador si la reventa fue completada
  fechaPublicacion?: Date;
  fechaReventa?: Date; // Fecha en la que se completó la reventa (opcional)
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


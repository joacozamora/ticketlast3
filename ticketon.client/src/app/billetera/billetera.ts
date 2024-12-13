export interface EntradaVentaDTO {
  id: number; // ID de la entrada venta
  entradaId: number; // ID de la entrada original
  ventaId: number; // ID de la venta
  usuarioId: string; // ID del usuario que compró la entrada
  eventoId: number;
  codigoQR: string; // Código QR asociado a la venta
  fechaAsignacion: Date; // Fecha en que se realizó la venta
  nombreEntrada: string; // Nombre de la entrada (puede venir de la relación con Entrada)
  imagenEvento: File | string; // URL de la imagen del evento
  correo: string; // Correo del organizador o usuario
  enReventa: boolean; // Nuevo campo: indica si la entrada está en reventa
}
export interface EventoEntradasDTO {
  eventoId: number;      // ID del evento
  nombreEvento: string;  // Nombre del evento
  imagenEvento: string;  // URL de la imagen del evento
  correo: string;
  entradas: EntradaVentaDTO[]; // Lista de entradas asociadas a este evento
}

export interface EntradaVentaEditableDTO extends EntradaVentaDTO {
  nuevoCorreo?: string;
}

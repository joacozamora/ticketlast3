export interface EntradaVentaDTO {
  id: number; // ID de la entrada venta
  entradaId: number; // ID de la entrada original
  ventaId: number; // ID de la venta
  usuarioId: string; // ID del usuario que compró la entrada
  codigoQR: string; // Código QR asociado a la venta
  fechaAsignacion: Date; // Fecha en que se realizó la venta
  nombreEntrada: string; // Nombre de la entrada (puede venir de la relación con Entrada)
}

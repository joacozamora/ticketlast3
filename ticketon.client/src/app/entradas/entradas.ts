export interface Entrada {
  id: number;
  nombreTanda: string;
  stock: number;
  precio: number;
  correoOrganizador?: string;
  idEvento?: number;
  nombreEvento: string;
}

export interface EntradaActualizacion {
  id: number;
  nombreTanda: string;
  stock: number;
  precio: number;
}

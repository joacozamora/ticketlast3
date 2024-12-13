export interface CredencialesUsuarioDTO extends CredencialesLoginDTO {
  nombre: string;
  apellido: string;
  telefono?: string; // Opcional
  dni?: string; // Opcional
}

export interface RespuestaAutenticacionDTO {
  token: string;
  expiracion: Date;
  userId: string;
}

export interface UsuarioDTO {
  email: string;
}

export interface CredencialesLoginDTO {
  email: string;
  password: string;
}

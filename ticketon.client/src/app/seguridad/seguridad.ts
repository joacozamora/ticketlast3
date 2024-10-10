export interface CredencialesUsuarioDTO {
  email: string;
  password: string;
}

export interface RespuestaAutenticacionDTO {
  token: string;
  expiracion: Date;
  userId: string;
}

export interface UsuarioDTO {
  email: string;
}

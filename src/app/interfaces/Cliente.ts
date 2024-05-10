export interface Cliente {
  id: number,
  nombres: string;
  apellidos: string;
  direccion: string;
  fechaNacimiento: Date;
  dpi: string;
  nit: string;
  empresa: string;
  contactos?: Contacto[];
  metodosDePago?: MetodoDePago[];
}

export interface Contacto {
  tipoContacto: string;
  valorContacto: string;
}

export interface MetodoDePago {
  tipo: string;
  numero: string;
  fechaVencimiento: Date;
  nombreTitular: string;
}


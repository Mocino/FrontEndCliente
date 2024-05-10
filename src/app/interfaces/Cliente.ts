export interface Cliente {
  idCliente: number,
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
  idContacto: number,
  idCliente: number,
  tipoContacto: string;
  valorContacto: string;
}

export interface MetodoDePago {
  tipo: string;
  numero: string;
  fechaVencimiento: Date;
  nombreTitular: string;
}


export interface TipoContacto {
  valor: string;
  nombre: string;
}

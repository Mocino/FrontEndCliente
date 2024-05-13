export interface Cliente {
  idCliente?: number,
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
  idMetodoPago: number,
  idCliente: number,
  tipo: Option;
  numero: string;
  fechaVencimiento: Date;
  nombreTitular: string;
}


export interface Option {
  valor: string;
  nombre: string;
}

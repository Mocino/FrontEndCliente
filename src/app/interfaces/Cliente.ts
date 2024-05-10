export interface Cliente {
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
  tipoContacto: TipoContacto;
  valorContacto: string;
}

export enum TipoContacto {
  Email = 'Email',
  Telefono = 'Telefono',
  Direccion = 'Direccion'
}

export interface MetodoDePago {
  tipo: TipoPago;
  numero: string;
  fechaVencimiento: Date;
  nombreTitular: string;
}

export enum TipoPago {
  TarjetaDeCredito = 'Tarjeta de Crédito',
  PayPal = 'PayPal',
  Otra = 'Otra'
}

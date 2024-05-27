import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador para email
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || emailPattern.test(value)) {
      return null;
    }
    return { emailInvalido: true };
  };
}

// Validador para teléfono
export function telefonoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const telefonoPattern = /^\d{8}$/;
    if (!value || telefonoPattern.test(value)) {
      return null;
    }
    return { telefonoInvalido: true };
  };
}

export function fechaTarjetaValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const fechaTarjeta = new Date(control.value);
  const fechaActual = new Date();

  if (fechaTarjeta < fechaActual) {
    return { fechaAnterior: true };
  }
  return null;
}

export function fechaNacimientoValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const fechaNacimiento = new Date(control.value);
  const edadMinima = 18;
  const fechaActual = new Date();
  const diferenciaFechas = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

  if (diferenciaFechas < edadMinima) {
    return { menorDeEdad: true };
  }

  return null;
}

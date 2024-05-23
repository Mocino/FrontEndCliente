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

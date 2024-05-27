export function ocultarDigitos(numero: string): string {
  if (numero.length <= 8) {
    return numero; // No se ocultan dígitos si la longitud es menor o igual a 8
  } else {
    const primeraParte = numero.substring(0, 4); // Obtener los primeros cuatro dígitos
    const segundaParte = '****'; // Reemplazar los restantes con asteriscos
    return primeraParte + segundaParte;
  }
}

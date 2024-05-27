import { MatSnackBar } from '@angular/material/snack-bar';

export function mostrarAlerta(snackBar: MatSnackBar, msg: string, accion: string): void {
  snackBar.open(msg, accion, {
    horizontalPosition: "end",
    verticalPosition: "top",
    duration: 3000
  });
}

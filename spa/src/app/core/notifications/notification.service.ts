import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class NotificationsService {
    private _snackBar = inject(MatSnackBar);

    success(message: string){
        this.openSnackBar(message, 'success', 3000);
    }

    error(message: string){
        this.openSnackBar(message, 'error', 3000);
    }

    warning(message: string){
        this.openSnackBar(message, 'warning', 3000);
    }

    info(message: string){
        this.openSnackBar(message, 'info', 3000);
    }

    openSnackBar(message: string, type: 'success' | 'error' | 'warning' | 'info' , duration: number, action: string = 'Close') {
        this._snackBar.open(message, action, {
            duration: duration,
            panelClass: `${type}-snackbar`
        });
    }
}
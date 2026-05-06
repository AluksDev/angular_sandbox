import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class NotificationsService {
    private _snackBar = inject(MatSnackBar);

    success(message: string){
        this.openSnackBar(message, 'success');
    }

    error(message: string){
        this.openSnackBar(message, 'error');
    }

    warning(message: string){
        this.openSnackBar(message, 'warning');
    }

    info(message: string){
        this.openSnackBar(message, 'info');
    }

    openSnackBar(message: string, type: 'success' | 'error' | 'warning' | 'info' , duration: number = 5000, action: string = 'Close') {
        this._snackBar.open(message, action, {
            duration: duration,
            panelClass: `${type}-snackbar`
        });
    }
}
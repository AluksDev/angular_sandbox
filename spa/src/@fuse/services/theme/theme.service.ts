import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FuseThemeService {
  private color = 'theme_original';
  private currentThemeSubject = new BehaviorSubject<string>(this.color); // Tema por defecto
  public currentTheme$ = this.currentThemeSubject.asObservable(); // Observable expuesto

  get getMainColorChanged$() {
    return this.currentThemeSubject.value;
  }

  changeTheme(newColor: string): void {
    this.currentThemeSubject.next('theme_' + newColor);
  }

  resetTheme(): void {
    this.currentThemeSubject.next(this.color);
  }
}

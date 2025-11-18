import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'password-strength',
  imports: [
    CommonModule,
  ],
  templateUrl: './password-strength.component.html',
})
export class PasswordStrengthComponent implements OnChanges {

  password = input.required<string>();

  strength = 0;
  barColor = 'gray';
  message = 'Introduce tu contraseña';

  private readonly patterns = {
    length: new RegExp('.{8,}'), 
    uppercase: new RegExp(FormUtils.uppercasePattern),
    number: new RegExp(FormUtils.numberPattern),
    special: new RegExp(FormUtils.specialPattern),
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['password']) {
      this.checkStrength();
    }
  }

  private checkStrength(): void {
    const p = this.password();
    
    if (!p) {
      this.strength = 0;
      this.barColor = 'gray';
      this.message = 'Introduce tu contraseña';
      return;
    }

    let score = 0;

    if (this.patterns.length.test(p)) {
      score += 1;
    }

    if (this.patterns.number.test(p)) {
      score += 1;
    }
    if (this.patterns.special.test(p)) {
      score += 1;
    }
    if (this.patterns.uppercase.test(p)) {
      score += 1;
    }

    this.strength = score;
    this.updateVisualIndicator(score);
  }
  
  private updateVisualIndicator(score: number): void {
    switch (score) {
      case 0:
        this.barColor = 'red';
        this.message = 'Muy débil';
        break;
      case 1:
        this.barColor = 'red';
        this.message = 'Débil';
        break;
      case 2:
        this.barColor = 'orange';
        this.message = 'Media';
        break;
      case 3:
        this.barColor = 'green';
        this.message = 'Fuerte';
        break;
      default:
        this.barColor = 'green';
        this.message = 'Muy fuerte';
        break;
    }
  }
}
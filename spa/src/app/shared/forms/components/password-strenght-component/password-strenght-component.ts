import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-password-strenght-component',
  imports: [],
  templateUrl: './password-strenght-component.html',
  styleUrl: './password-strenght-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrenghtComponent {
  password = input.required<string>();

  // Derived strenght signal
  strenght = computed(() => {
    const pwd = this.password();
    if (!pwd) return 0;
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    return score; // Returns 0 to 4
  });

  // Derived text for the UI
  strenghtText = computed(() => {
    const scores = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return scores[this.strenght()];
  });
 }

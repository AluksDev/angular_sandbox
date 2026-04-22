import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-password-strength-component',
  imports: [],
  templateUrl: './password-strength-component.html',
  styleUrl: './password-strength-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthComponent {
  password = input.required<string>();

  // Derived strength signal
  strength = computed(() => {
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
  strengthText = computed(() => {
    const scores = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return scores[this.strength()];
  });
 }

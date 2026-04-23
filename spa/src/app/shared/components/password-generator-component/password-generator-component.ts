import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-password-generator-component',
  imports: [MatIconModule],
  templateUrl: './password-generator-component.html',
  styleUrl: './password-generator-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordGeneratorComponent {
  generatedPassword = signal<string>('Password generator');

  generatePassword() {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{};:,.?";
    const all = lower + upper + numbers + symbols;
    const totalLength = 12;

    //Ensure one of each type
    let password: string[] = [
      lower[Math.floor(Math.random() * lower.length)],
      upper[Math.floor(Math.random() * upper.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    for (let i = password.length; i < totalLength; i++) {
      password.push(all[Math.floor(Math.random() * all.length)]);
    }

    this.generatedPassword.set(this.shufflePassword(password).join(""));
  }

  //Fisher–Yates shuffle algorithm
  shufflePassword(array: string[]): string[] {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
  }

  copyPswToClipboard() {
    if (this.generatedPassword() === '') return null;
    navigator.clipboard.writeText(this.generatedPassword());
  }
 }

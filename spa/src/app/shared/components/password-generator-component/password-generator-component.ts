import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-password-generator-component',
  imports: [MatIconModule],
  templateUrl: './password-generator-component.html',
  styleUrl: './password-generator-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordGeneratorComponent { }

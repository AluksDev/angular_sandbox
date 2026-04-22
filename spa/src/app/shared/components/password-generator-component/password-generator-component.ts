import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-password-generator-component',
  imports: [],
  templateUrl: './password-generator-component.html',
  styleUrl: './password-generator-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordGeneratorComponent { }

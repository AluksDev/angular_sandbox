import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

interface CardDetailsFormat {
  title: string,
  details: string
}

@Component({
  selector: 'app-profile-card-component',
  imports: [MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './profile-card-component.html',
  styleUrl: './profile-card-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent {
  title = input<string>();
  cardDetails = input<CardDetailsFormat[]>();
  iconName = computed(() => {
    switch (this.title()){
      case 'Personal info':
        return 'account_circle';
      case 'Department':
        return 'apartment';
      case 'Account status':
        return 'tune';
    }
  })
 }

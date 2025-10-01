import { Component, inject, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-still-here',
  templateUrl: './still-here.component.html',
  styleUrls: ['./still-here.component.scss'],

  imports: [MatDialogModule, MatButtonModule],
})
export class StillHereComponent implements OnInit {
  dialogRef = inject<MatDialogRef<StillHereComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);

  seconds = 60;
  clock: Subscription;
  source = timer(0, 1000);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.clock = this.source.subscribe(() => {
      this.seconds -= 1;
      if (this.seconds < 1) {
        this.clock.unsubscribe();
        this.dialogRef.close(true);
      }
    });
  }
}

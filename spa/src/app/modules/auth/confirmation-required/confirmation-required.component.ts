import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'auth-confirmation-required',
  templateUrl: './confirmation-required.component.html',
  animations: fuseAnimations,

  imports: [RouterLink, NgOptimizedImage],
})
export class AuthConfirmationRequiredComponent {
  /**
   * Constructor
   */
  constructor() {}
}

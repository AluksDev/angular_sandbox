import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],

  imports: [RouterOutlet],
  encapsulation: ViewEncapsulation.None,
})
export class ContentComponent {
  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Constructor
   */
  constructor() {}
}

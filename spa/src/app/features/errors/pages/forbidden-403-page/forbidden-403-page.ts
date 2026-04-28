import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-forbidden-403-page',
  imports: [RouterLink],
  templateUrl: './forbidden-403-page.html',
  styleUrl: './forbidden-403-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Forbidden403Page { }

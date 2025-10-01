import { Component } from "@angular/core";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-error404",
  templateUrl: "./error404.component.html",
  styleUrls: ["./error404.component.scss"],

  imports: [MatIcon],
})
export class Error404Component {
  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  goBack(): void {
    window.history.go(-2);
  }
}

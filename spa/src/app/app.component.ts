import { Component } from "@angular/core";
import { MainLayout } from "./layouts/main-layout/main-layout";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [MainLayout],
  providers: [],
})
export class AppComponent {}

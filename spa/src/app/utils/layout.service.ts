import { Injectable, signal } from "@angular/core";

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({ providedIn: "root" })
export class LayoutService {
  private _showBreadcrumbs = signal(true);
  private _showMenu = signal(true);
  private _showTitle = signal("");
  private _breadcrumbs = signal<Breadcrumb[]>([]);

  getShowBreadcrumbs = this._showBreadcrumbs.asReadonly();
  getShowMenu = this._showMenu.asReadonly();
  getShowTitle = this._showTitle.asReadonly();
  getBreadcrumbs = this._breadcrumbs.asReadonly();

  setShowBreadcrumbs(value: boolean) {
    this._showBreadcrumbs.set(value);
  }
  
  setShowMenu(value: boolean) {
    this._showMenu.set(value);
  }

  setShowTitle(value: string) {
    this._showTitle.set(value);
  }

  setBreadcrumbs(value: Breadcrumb[]) {
    this._breadcrumbs.set(value);
  }

  pushBreadcrumb(breadcrumb: Breadcrumb) {
    this._breadcrumbs.update((prev) => [...prev, breadcrumb]);
  }

  cleanBreadcrumbs() {
    this._breadcrumbs.set([]);
  }
}

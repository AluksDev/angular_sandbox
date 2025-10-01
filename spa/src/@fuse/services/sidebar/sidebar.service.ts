import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

export class SidebarElement {
  type: string;
  element: any;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _elements: SidebarElement[] = [];
  private _changeCurrent: ReplaySubject<SidebarElement>;
  private _size = 'small'; // 'small' or 'big'

  // Observable for fold/unfold events
  folded$: Observable<boolean>;
  private folded = new ReplaySubject<boolean>();

  get size(): string {
    return this._size;
  }

  set size(newSize: string) {
    if (['small', 'big'].includes(newSize)) {
      this._size = newSize;
    }
  }

  constructor() {
    this._changeCurrent = new ReplaySubject<SidebarElement>(1);
    this.folded$ = this.folded.asObservable();
  }

  current(): SidebarElement {
    if (this._elements.length > 0) {
      return this._elements[this._elements.length - 1];
    }
    return null;
  }

  fold(): void {
    this.folded.next(true);
  }

  unfold(): void {
    this.folded.next(false);
  }

  push(element: SidebarElement): void {
    if (this._elements.length && this._elements[this._elements.length - 1].element === element.element) {
      this.pop();
    } else {
      this._elements.push(element);
      this._changeCurrent.next(element);
    }
  }

  set(element: SidebarElement): void {
    if (this._elements.length && this._elements[this._elements.length - 1].element === element.element) {
      this.pop();
    } else {
      this._elements = [element];
      this._changeCurrent.next(element);
    }
  }

  pop(): void {
    this._elements.pop();
    this._changeCurrent.next(this.current());
  }

  length(): number {
    return this._elements.length;
  }

  close(): void {
    this._elements = [];
    this._changeCurrent.next(null);
  }

  changeCurrent(): Observable<SidebarElement> {
    return this._changeCurrent.asObservable();
  }
}

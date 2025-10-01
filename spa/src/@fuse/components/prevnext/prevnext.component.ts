import { AfterViewInit, Component, EventEmitter, inject, input, Output } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { MatIconButton } from '@angular/material/button';

import { PrevNextEntity, PrevnextService } from '../../services/prevnext';

@Component({
  selector: 'app-prevnext',
  templateUrl: './prevnext.component.html',

  styleUrls: ['./prevnext.component.scss'],
  imports: [MatIconButton],
})
export class PrevNextComponent implements AfterViewInit {
  prevNextService = inject(PrevnextService);

  /**
   * Stores the entity type of the current element view
   */
  entityType = input<string>();

  /**
   * Id of the current entity
   */
  entityId = input<number>();

  /**
   * When move to the next or prev, it emites an event with the entity id to go
   */
  @Output() moveTo: EventEmitter<PrevNextEntity>;
  @Output() newPage: EventEmitter<PrevNextEntity[]>;

  public initialized = false;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.moveTo = new EventEmitter<PrevNextEntity>();
    this.newPage = new EventEmitter<PrevNextEntity[]>();
    this.prevNextService.newPage
      .pipe(
        tap((results) => {
          this.newPage.emit(results);
        }),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.prevNextService.init(() => (this.initialized = true)), 100);
  }

  next(): void {
    this.prevNextService
      .next(this.entityId())
      .pipe(map((element) => this.moveTo.emit(element)))
      .subscribe();
  }

  prev(): void {
    this.prevNextService
      .prev(this.entityId())
      .pipe(map((element) => this.moveTo.emit(element)))
      .subscribe();
  }
}

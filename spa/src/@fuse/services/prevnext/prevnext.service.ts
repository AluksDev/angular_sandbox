import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Every element managed by PrevNextService has to have an id
 */
export interface PrevNextEntity {
  id?: number;
}

/**
 * Every element list managed by PrevNextService as a result of the execution of a FormService has to have the total
 * count of elements in the server, and an array of PrevNextEntity
 */
interface PrevNextEntityList {
  count: number;
  results: PrevNextEntity[];
}

/**
 * Every FormService managed by PrevNextService has to have a form and a submit method
 */
interface FormService {
  form: FormGroup;

  submit(value?: any, cache?: boolean, onlyCache?: boolean): Observable<PrevNextEntityList>;
}

@Injectable({
  providedIn: 'root',
})
export class PrevnextService {
  /**
   * This Service is going to store a window of elements, therefore it will find the next and previous element of a
   * given one, using the initial id, and the desired offset.
   *
   * In the case of requiring an element outside the current window, it will use the FormService to reach another
   * page of results.
   *
   * For example: Let's say the FormService is able to reach 10 elements, and initially the PrevNextService has been
   * started in the window 2 to 4 with this sequence of element ids: [5, 8].
   * - If we ask for the next of 5: it will find element id 5, and return the next one, which is 8
   * - If we ask for the prev of 8: it will find element id 8, and return the previous one, which is 5
   * - If we ask for the next of 8: it will check if 8 has a next, and as 8 is the 4th element of 10, it will run the
   *   FormService to reach the next page. After that, the stored sequence is going to have the window 2 to 6, for
   *   example current sequence could be [5, 8, 3, 9]. Therefore it will return the id of the next element of 8, so 3
   * - If we ask for the next 7, as 7 is not a known element, it will return NULL
   * - If we already have the window 0 to x [3, 5,...], and we ask for the prev of element id 3, it will return NULL,
   *   because there is no previous element of 3, and it also is going to raise an error in the console.
   *
   * This Service will implement not just the prev() and next() methods, but also hasPrev() and hasNext() to help avoid
   * errors
   */

  // sequence of stored elements
  private _sequence: PrevNextEntity[];

  // total number of elements in the server for the current formService
  private _count: number;
  /**
   * Returns the number of elements in the FormService
   */
  get count(): number {
    return this._count;
  }

  private _newPage: ReplaySubject<PrevNextEntity[]>;
  get newPage(): Observable<PrevNextEntity[]> {
    return this._newPage.asObservable();
  }

  // range min and max of the stored element ids. For example the server could have 100 elements
  // but by the moment _sequence stores just elements in the range 20 to 30
  private _range_min: number;
  private _range_max: number;

  private _formService: FormService;
  /**
   * Stores the FormService to be used in PrevNext movements. After setting this value it is necessary to set the
   * entityType
   * @param fs FormService that stores the current search configuration
   */
  set formService(fs: FormService) {
    this._formService = fs;
    this._sequence = [];
    this._count = null;
    this._range_min = null;
    this._range_max = null;
    this._entityType = null;
  }

  private _entityType: string;
  /**
   * Stores the Entity managed by the FormService to be used in PrevNext movements
   * @param et Entity type used by the FormService
   */
  set entityType(et: string) {
    this._entityType = et;
  }
  /**
   * Retuns the current entityType managed by the FormService
   */
  get entityType(): string {
    return this._entityType;
  }

  constructor() {
    this._newPage = new ReplaySubject<PrevNextEntity[]>(1);
  }

  /**
   * Initialize the Service if it is not initialized yet, using the current FormService
   */
  init(onInitialized?: () => void): void {
    if (this._formService !== undefined) {
      if (this._count == null) {
        // If the configuration is not been initiated jet, it runs the FormService to obtain the current page
        // then it will returns the result of executing the method get again with same parameters
        this._formService
          .submit(false, true, true)
          .pipe(
            map((result) => {
              this._sequence = result.results;
              setTimeout(() => this._newPage.next(result.results), 3500);
              this._count = result.count;
              const payload = this._formService.form.value;
              this._range_min = payload.offset;
              this._range_max = payload.offset + payload.limit;
              if (this._range_max > this._count) {
                this._range_max = this._count;
              }
              onInitialized();
            }),
          )
          .subscribe();
      } else {
        onInitialized();
      }
    }
  }

  /**
   * Returns the current position of the given element id in the result list of the FormService.
   * If the PrevNextService is not initialized, it returns null
   * If the element id is not a known element, it returns null
   * @param id Element id to search in the result list
   */
  position(id: number): number {
    if (this._count == null) {
      // If the Service is not been initiated yet, it returns NULL, and call the init method
      this.init();
      return null;
    }

    let position = this._sequence.findIndex((val) => val.id === id);
    if (position === -1) {
      // the given id is not a known element, thus it returns NULL
      return null;
    }

    position += this._range_min;
    return position;
  }

  /**
   * Returns if the specified element id has a prev element or not
   * @param id id of the specified element
   */
  hasPrev(id: number): boolean {
    return this.exists(id, -1);
  }

  /**
   * Returns and Observable to the previous element of the specified one
   * @param id id of the specified element
   */
  prev(id: number): Observable<PrevNextEntity> {
    return this.get(id, -1);
  }

  /**
   * Returns if the specified element id has a next element or not
   * @param id of the specified element
   */
  hasNext(id: number): boolean {
    return this.exists(id, 1);
  }

  /**
   * Returns and Observable to the next element of the specified one
   * @param id id of the specified element
   */
  next(id: number): Observable<PrevNextEntity> {
    return this.get(id, 1);
  }

  // Private methods
  /**
   * Return an Observable of the element which is offset positions respect to a given id.
   * If the initial id is not known, it returns null
   * @param id id of the initial element
   * @param offset elements of difference between the initial object and the desired one
   */
  private get(id: number, offset: number): Observable<PrevNextEntity> {
    const subject = new ReplaySubject<PrevNextEntity>(1);

    if (this._count == null) {
      // If the configuration is not been initiated jet, it runs the FormService to obtain the current page
      // then it will returns the result of executing the method get again with same parameters
      this.init(() =>
        this.get(id, offset)
          .pipe(map((val) => subject.next(val)))
          .subscribe(),
      );
    } else {
      // First step is to calculate the required position in the sequence
      let position = this.position(id);
      if (position == null) {
        // the given id is not a known element, thus it returns NULL
        subject.next(null);
      }
      position += offset;

      // If the required position is out of server range, it returns NULL and raises a console error
      if (position < 0 || position >= this._count) {
        console.error('Asking for postion ' + position + ' which is not in the range 0 - ' + (this._count - 1));
        subject.next(null);
      } else if (this._range_min <= position && position < this._range_max) {
        // If the required position is in the stored window, it returns it directly
        subject.next(this._sequence[position - this._range_min]);
      } else {
        // It needs to reach another page
        const payload = this._formService.form.value;
        if (position < this._range_min) {
          payload.offset = this._range_min - payload.limit;
        } else {
          payload.offset = this._range_max;
        }

        this._formService
          .submit(payload)
          .pipe(
            map((result) => {
              this._count = result.count;
              this._sequence = result.results;
              setTimeout(() => this._newPage.next(result.results), 3500);
              this._range_min = payload.offset;
              this._range_max = this._range_min + payload.limit;
              if (this._range_max > this._count) {
                this._range_max = this._count;
              }

              if (position === this._range_min) {
                subject.next(this._sequence[0]);
              } else {
                subject.next(this._sequence[payload.limit - 1]);
              }
            }),
          )
          .subscribe();
      }
    }

    return subject.asObservable();
  }

  /**
   * Returns if the relative element respect the initial given exists or not. It will return NULL if the Service is not
   * been initiated yet, or if the specified element id is not known
   * @param id initial element id
   * @param offset elements of difference between tje initial object and the desired one
   */
  private exists(id: number, offset: number): boolean {
    let position = this.position(id);
    if (position == null) {
      return null;
    }
    position += offset;

    return position >= 0 && position < this._count;
  }
}

/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'environments/environment';

import { ProvinciesService } from '../../../controllers/Provincies';
import * as __model from '../../../model';

@Injectable({ providedIn: 'root' })
export class ProvinciesByNomFormService {
  private provinciesService = inject(ProvinciesService);

  form: FormGroup;
  defaultValue: any;
  serverErrors$: Observable<any>;
  private serverErrorsSubject: ReplaySubject<any>;
  loading$: Observable<boolean>;
  private loadingSubject: ReplaySubject<boolean>;
  currentValue: any;
  private cache: any;
  private cacheSub: any;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {
    this.form = new FormGroup({
      nom: new FormControl({ value: undefined, disabled: false }, [Validators.required]),
      maxRegs: new FormControl({ value: undefined, disabled: false }, []),
    });
    this.defaultValue = this.form.value;
    this.serverErrorsSubject = new ReplaySubject<any>(1);
    this.serverErrors$ = this.serverErrorsSubject.asObservable();
    this.loadingSubject = new ReplaySubject<boolean>(1);
    this.loading$ = this.loadingSubject.asObservable();
    this.cache = {};
    this.cacheSub = {};
  }

  submit(value: any = false, cache = true, only_cache = false): Observable<__model.ConjuntElementsProvincia> {
    if (value === false) {
      value = this.form.value;
    }
    if (this.cacheSub[JSON.stringify(value)]) {
      return this.cacheSub[JSON.stringify(value)].asObservable();
    }
    this.cacheSub[JSON.stringify(value)] = new ReplaySubject<__model.ConjuntElementsProvincia>(1);
    const subject = this.cacheSub[JSON.stringify(value)];
    let cache_hit = false;
    if (cache && this.cache[JSON.stringify(value)]) {
      subject.next({ ...this.cache[JSON.stringify(value)] });
      cache_hit = true;
      if (only_cache) {
        subject.complete();
        this.loadingSubject.next(false);
        delete this.cacheSub[JSON.stringify(value)];
        return subject.asObservable();
      }
    }
    this.loadingSubject.next(true);
    this.serverErrorsSubject.next(null);
    this.currentValue = value;
    this.try(subject, value, cache_hit, cache);
    return subject.asObservable();
  }

  try(
    subject: ReplaySubject<__model.ConjuntElementsProvincia>,
    value: any,
    cache_hit: boolean,
    cache: boolean,
    waitOnRetry = 1000,
    maxRetries = environment.apiRetries,
  ): void {
    if (JSON.stringify(value) !== JSON.stringify(this.currentValue)) {
      subject.complete();
      delete this.cacheSub[JSON.stringify(value)];
      return;
    }
    const result = this.provinciesService.byNom(value);
    result
      .pipe(
        map((val) => {
          if (!cache_hit || JSON.stringify(this.cache[JSON.stringify(value)]) !== JSON.stringify(val)) {
            if (cache) {
              this.cache[JSON.stringify(value)] = val;
            }
            subject.next({ ...val });
          }
          subject.complete();
          delete this.cacheSub[JSON.stringify(value)];
          this.loadingSubject.next(false);
          return val;
        }),
        catchError((error) => {
          if (error.status >= 500 && maxRetries > 0) {
            // A client-side or network error occurred. Handle it accordingly.
            setTimeout(
              () => this.try(subject, value, cache_hit, cache, waitOnRetry + 1000, maxRetries - 1),
              waitOnRetry,
            );
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            this.serverErrorsSubject.next(error.error);
            subject.error(error);
            subject.complete();
            delete this.cacheSub[JSON.stringify(value)];
            this.loadingSubject.next(false);
          }
          return throwError(() => error);
        }),
      )
      .subscribe();
  }

  cancelPreviousRequest(): void {
    Object.keys(this.cacheSub).forEach((key) => this.cacheSub[key].unsubscribe());
    this.cacheSub = {};
  }

  reset(value?: any): void {
    this.form.reset();
    this.serverErrorsSubject.next(null);
    this.loadingSubject.next(false);
    this.form.patchValue(this.defaultValue);
    if (value) {
      this.form.patchValue(value);
    }
  }

  patch(value: any): void {
    this.form.patchValue(value);
  }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AiTranslationPackageService } from '@api/controllers/AiTranslationPackage';
import { TranslationService } from '@api/controllers/Translation';
import { TranslationTask } from '@api/defs/TranslationTask';
import {
  AiTranslationPackageMassiveTranslationFormService,
  TranslationCreateFormService,
  TranslationDeleteFormService,
  TranslationListFormService,
  TranslationSendLinguaServeFormService,
} from '@api/form-service';
import { IfAllowedDirective } from '@utils/directives/if-allowed.directive';
import { of, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { GlobalDataService } from '@utils/global-data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ConfirmDialogComponent } from '@fuse/components/dialogs/confirm/confirm.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpendingCenter } from '@api/defs/SpendingCenter';
import { TranslationList } from '@api/defs/TranslationList';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';

import { InlineTranslationDialogComponent } from '../inline-translation-dialog/inline-translation-dialog.component';
import { PriorityDialogComponent } from '../priority-dialog/priority-dialog.component';

export interface DialogConfig {
  contentType: string;
  contentId: number;
}

@Component({
  selector: 'app-translation-dialog',
  templateUrl: './translation-dialog.component.html',
  styleUrls: ['./translation-dialog.component.scss'],
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatDialogActions,
    MatDialogModule,
    DatePipe,
    IfAllowedDirective,
    NgSelectComponent,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  providers: [
    TranslationService,
    TranslationListFormService,
    TranslationDeleteFormService,
    TranslationCreateFormService,
    TranslationSendLinguaServeFormService,
    AiTranslationPackageService,
    AiTranslationPackageMassiveTranslationFormService,
  ],
})
export class TranslationDialogComponent implements OnInit, OnDestroy {
  private globalDataService = inject(GlobalDataService);
  config = inject<DialogConfig>(MAT_DIALOG_DATA);
  translationFS = inject(TranslationListFormService);
  private translationCreateFS = inject(TranslationCreateFormService);
  private translationCancelFS = inject(TranslationDeleteFormService);
  private linguaServeCreateFS = inject(TranslationSendLinguaServeFormService);
  private massiveTranslationFS = inject(AiTranslationPackageMassiveTranslationFormService);
  private dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  contentTypeId: number;
  languages = [
    { id: 'es', name: 'castellà' },
    { id: 'en', name: 'anglès' },
    { id: 'fr', name: 'francès' },
    { id: 'ca', name: 'català' },
  ];

  translations: {
    es: TranslationTask | undefined;
    en: TranslationTask | undefined;
    fr: TranslationTask | undefined;
    ca: TranslationTask | undefined;
  } = { es: undefined, en: undefined, fr: undefined, ca: undefined };

  private unsubscribe$: Subject<void> = new Subject();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.globalDataService.contentTypes$
      .pipe(
        tap((data) => {
          this.contentTypeId = data[this.config.contentType];
          this.loadTranslations();
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadTranslations(): void {
    this.languages.forEach((lang) => {
      this.translationFS
        .submit({
          content_type: this.contentTypeId,
          object_id: this.config.contentId,
          target_lang: lang.id,
          limit: 1,
        })
        .pipe(tap((trans: TranslationList) => (this.translations[lang.id] = trans.results[0])))
        .subscribe();
    });
  }

  requestTranslation(lang: string): void {
    const dialogRef = this.dialog.open(PriorityDialogComponent, {
      width: '650px',
    });
    dialogRef
      .afterClosed()
      .pipe(
        // filter((result) => result),
        switchMap((result: { priority: string; spending_center: SpendingCenter; translator_option: string }) => {
          if (
            !result.spending_center ||
            (result.spending_center &&
              (result.spending_center.openai_key === null || result.spending_center.openai_key === ''))
          ) {
            return this.translationCreateFS.submit({
              data: {
                content_type: this.contentTypeId,
                object_id: this.config.contentId,
                target_lang: lang,
                priority: result.priority,
              },
            });
          } else if (
            result.translator_option === 'openai' &&
            result.spending_center.openai_key !== null &&
            result.spending_center.openai_key !== ''
          ) {
            return this.massiveTranslationFS.submit({
              data: {
                content_type: this.contentTypeId,
                id_list: this.config.contentId.toString(),
                target_lang: lang,
                description:
                  'Traducció directa de entitat ' + this.config.contentId + ' - Prioritat ' + result.priority,
              },
            });
          } else {
            return this.linguaServeCreateFS.submit({
              data: {
                content_type: this.contentTypeId,
                object_id: this.config.contentId,
                target_lang: lang,
                priority: result.priority,
                spending_center: result.spending_center.id,
              },
            });
          }
        }),
        tap((translation) => {
          this.translations[lang] = translation;
          this.snackBar.open("Traducció sol·licitada. S'ha afegit a la cua de pendents.", 'Tancar', {
            duration: 5000,
          });
        }),
        catchError(() => {
          this.snackBar.open("S'ha produït un error en sol·licitar la traducció.", 'Tancar', {
            panelClass: 'error',
            duration: 5000,
          });
          return of({});
        }),
      )
      .subscribe();
  }

  cancelTranslation(translation: TranslationTask): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: {
        title: 'Confirma cancel·lació',
        text: 'Segur que vols cancel·lar la sol·licitud de traducció?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.translationCancelFS.form.patchValue({
          id: translation.id,
        });
        this.translationCancelFS
          .submit()
          .pipe(
            takeUntil(this.unsubscribe$),
            map(() => {
              // Get translations again
              this.loadTranslations();
              this.snackBar.open("La sol·licitud de traducció s'ha cancel·lat.", 'Tancar', {
                duration: 5000,
              });
            }),
            catchError((error) => {
              this.snackBar.open("No s'ha pogut cancel·lar la sol·licitud de traducció", 'Tancar', {
                panelClass: 'error',
                duration: 5000,
              });
              return throwError(() => error);
            }),
          )
          .subscribe();
      }
    });
  }

  inlineTranslation(lang: string): void {
    // There are 3 possibilities for doing a translation
    // 1. There is no active request, so we need to get the translations texts first and use the create form
    // 2. There is a request, and we can get the texts from the request and use the update form
    // 3. There is a translation and we can update it using the update form

    let data: Object;
    if (this.translations[lang]) {
      // These are cases 2 and 3
      data = { translation: this.translations[lang] };
    } else {
      // This is case 1, there is no active request so we create one from scratch
      data = {
        translation: {
          content_type: this.contentTypeId,
          object_id: this.config.contentId,
          target_lang: lang,
        },
      };
    }

    const dialogRef = this.dialog.open(InlineTranslationDialogComponent, {
      width: '600px',
      panelClass: 'fullScreen',
      data: data,
    });
    dialogRef.afterClosed().subscribe((translation) => {
      if (translation) {
        this.translations[lang] = translation;
        this.snackBar.open('Traducció guardada correctament.', 'Tancar', {
          duration: 5000,
        });
      }
    });
  }
}

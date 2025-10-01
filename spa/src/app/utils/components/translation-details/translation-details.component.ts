import { Component, effect, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { TranslationTask } from '@api/model';
import { TranslationDialogComponent } from '@utils/components/translation-details/translation-dialog/translation-dialog.component';
import { GlobalDataService } from '@utils/global-data.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-translation-details',
  templateUrl: './translation-details.component.html',
  styleUrls: ['./translation-details.component.scss'],
  imports: [MatGridTile, MatGridList, MatIconButton],
})
export class TranslationDetailsComponent {
  private globalDataService = inject(GlobalDataService);
  private dialog = inject(MatDialog);

  contentType = input<string>();
  id = input<number>();
  displayTitle = input(false);

  languages = [
    { id: 'es', name: 'castellà' },
    { id: 'en', name: 'anglès' },
    { id: 'fr', name: 'francès' },
    { id: 'ca', name: 'català' },
  ];
  contentTypeId: number;
  n_langs = 0;
  translations: {
    es: TranslationTask | undefined;
    en: TranslationTask | undefined;
    fr: TranslationTask | undefined;
    ca: TranslationTask | undefined;
  } = { es: undefined, en: undefined, fr: undefined, ca: undefined };

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    effect(() => {
      const idLocal = this.id();
      this.globalDataService.contentTypes$
        .pipe(
          tap((data) => {
            this.contentTypeId = data[this.contentType()];
            // this.loadTranslations();
          }),
        )
        .subscribe();
    });
  }

  openTranslationDialog(): void {
    this.dialog.open(TranslationDialogComponent, {
      width: '800px',
      data: { contentType: this.contentType(), contentId: this.id() },
    });
  }
}

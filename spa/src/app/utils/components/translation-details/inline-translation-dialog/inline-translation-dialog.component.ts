import { TranslationService } from '@api/controllers/Translation';
import { TranslationReadFormService } from '@api/forms/translation/read/read.service';
import { TranslationTask } from '@api/defs/TranslationTask';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import {
  TranslationCreateFormService,
  TranslationGetTranslationTextsFormService,
  TranslationUpdateFormService,
} from '@api/form-service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { BCNWaitingButtonDirective } from '@fuse/directives/bcn-waiting-button/bcn-waiting-button.directive';
import { MatButtonModule } from '@angular/material/button';
import { RuntimeConfigService } from '@app/runtime-config.service';
import { QuillModule } from 'ngx-quill';

interface DialogConfig {
  translation: TranslationTask;
}

@Component({
  selector: 'app-inline-translation-dialog',
  templateUrl: './inline-translation-dialog.component.html',

  styleUrls: ['./inline-translation-dialog.component.scss'],
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatInputModule,
    QuillModule,
    BCNWaitingButtonDirective,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatInputModule,
  ],
  providers: [
    TranslationReadFormService,
    TranslationService,
    TranslationGetTranslationTextsFormService,
    TranslationCreateFormService,
    TranslationUpdateFormService,
  ],
})
export class InlineTranslationDialogComponent {
  config = inject<DialogConfig>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<InlineTranslationDialogComponent>>(MatDialogRef);
  private http = inject(HttpClient);
  private runtimeConfigService = inject(RuntimeConfigService);
  protected unsubscribe$: Subject<void> = new Subject();

  translation$: Observable<TranslationTask>;
  formService: TranslationCreateFormService | TranslationUpdateFormService;
  form: FormGroup;
  languages = {
    es: 'castellà',
    en: 'anglès',
    fr: 'francès',
  };

  wysiwygConfig = {
    toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']],
    clipboard: {
      matchVisual: false,
    },
  };

  translating = false;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    const translationReadFS = inject(TranslationReadFormService);
    const translationTextReadFS = inject(TranslationGetTranslationTextsFormService);
    const translationCreateFS = inject(TranslationCreateFormService);
    const translationUpdateFS = inject(TranslationUpdateFormService);
    const config = this.config;

    let task: Observable<TranslationTask>;

    // Config form for creation or update
    if (!config.translation.id) {
      this.formService = translationCreateFS;
      translationTextReadFS.reset({ data: config.translation });
      task = this.translation$ = translationTextReadFS.submit();
    } else {
      this.formService = translationUpdateFS;
      task = this.translation$ = translationReadFS.submit({
        id: config.translation.id,
        expand: '~all',
      });
    }

    // Submit the form
    task
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((translation) => {
          // We need to initialize the translation with the current target texts
          translation.translations = translation.target_texts;

          this.formService.reset({ data: translation, id: translation.id });
        }),
      )
      .subscribe();

    this.form = this.formService.form;
  }

  isHTML(str: any): boolean {
    const a = document.createElement('div');
    a.innerHTML = str;

    for (let c = a.childNodes, i = c.length; i--; ) {
      if (c[i].nodeType === 1) {
        return true;
      }
    }

    return false;
  }

  _patch_with_lucy_results(pending: any, translated: any): void {
    if (pending === 0) {
      this.translating = false;

      this.form.controls.data.patchValue({
        translations: translated,
      });
    }
  }

  regreplace(regex: any, str: any): any {
    let m;
    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      let _tmp;
      m.forEach((match: any, group: any) => {
        if (group % 2 === 0) {
          _tmp = match;
        } else {
          str = str.replaceAll(_tmp, match);
        }
      });
    }

    return str;
  }

  trigger_lucy(): void {
    this.translating = true;

    const target = {
      es: 'SPANISH',
      en: 'ENGLISH',
    };
    const to = target[this.config.translation.target_lang];

    const translated = [];
    let pending = this.form.value.data.translations.filter((v) => !!v.value).length;
    if (pending === 0) {
      this.translating = false;
      return;
    }

    this.form.value.data.translations.forEach((txtObj) => {
      translated.push({ id: txtObj.id, value: '' });

      if (!txtObj.value) {
        return;
      }

      let txt = txtObj.value;

      if (this.isHTML(txtObj.value)) {
        txt = '<html lang="">' + txt + '</html>';
      }

      txt = txt
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

      const payload = `
        <task>
          <inputParams>
              <param name="TRANSLATION_DIRECTION" value="CATALAN-${to}" />
              <param name="SUBJECT_AREAS" value="(GV)" />
              <param name="INPUT" value="${txt}" />
          </inputParams>
        </task>
      `;

      if (!this.runtimeConfigService.config['lucyUrl']) {
        return;
      }

      firstValueFrom(
        this.http.post(this.runtimeConfigService.config['lucyUrl'], payload, {
          headers: new HttpHeaders({
            'Content-Type': 'application/xml',
            Accept: 'application/xml',
            'Response-Type': 'text',
          }),
          responseType: 'text' as 'json', // Asegúrate de especificar el tipo de respuesta correctamente
        }),
      )
        .then((result: string) => {
          const dp = new window['DOMParser']();
          const xml = dp.parseFromString(result, 'text/xml');
          const el = xml.getElementsByTagName('outputParams')[0];
          const cn = el.childNodes[0] as Element;

          let txt = cn
            .getAttribute('value')
            .replace(/&apos;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&');

          txt = txt.replace('**en_gb**', '');
          txt = this.regreplace(/<U\[(.*?)]>/gm, txt);
          txt = this.regreplace(/<A\[(.*?)\|.*?]>/gm, txt);

          translated.forEach((v) => {
            if (v.id === txtObj.id) {
              v.value = txt;
            }
          });
          this._patch_with_lucy_results(--pending, translated);
        })
        .catch(() => {
          // TODO: Handle errors?
          this._patch_with_lucy_results(--pending, translated);
        });
    });
  }

  save(): void {
    this.formService
      .submit()
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((result) => {
          this.dialogRef.close(result);
        }),
      )
      .subscribe();
  }
}

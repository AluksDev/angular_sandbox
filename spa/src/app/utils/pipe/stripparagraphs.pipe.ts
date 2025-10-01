import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripparagraphs',
})
export class StripparagraphsPipe implements PipeTransform {
  transform(input: string): string {
    return input
      .replace(/<p>/g, '')
      .replace(/<\/p>$/, '')
      .replace(/<\/p>/g, '<br>');
  }
}

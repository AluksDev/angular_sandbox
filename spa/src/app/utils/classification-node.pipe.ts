import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'classificationNode' })
export class ClassificationNodePipe implements PipeTransform {
  transform(value: string): string[] {
    if (value) {
      return value.split('>>');
    } else {
      return [''];
    }
  }
}

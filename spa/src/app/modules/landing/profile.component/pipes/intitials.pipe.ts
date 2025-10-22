import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'initials'
})

export class InitialsPipe implements PipeTransform {
    transform(fullName: string): string {
    if (!fullName) return '';

    const words = fullName.trim().split(/\s+/);
    const initials = words.map(w => w[0]).join('');
    return initials.toUpperCase();
  }
}
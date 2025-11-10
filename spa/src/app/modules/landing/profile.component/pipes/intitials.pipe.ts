import { Pipe, PipeTransform } from '@angular/core';


/**
 * InitialsPipe
 *
 * A custom Angular pipe that extracts and returns the uppercase initials
 * from a given full name string.
 *
 */
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
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'alphaShort'
})

export class AlphaShortPipe implements PipeTransform {
    transform(value: any, ascendent: boolean): any {
        
        if (!ascendent) return value.sort((a,b) => b.name.localeCompare(a.name));

        return value.sort((a,b) => a.name.localeCompare(b.name));

    }
}
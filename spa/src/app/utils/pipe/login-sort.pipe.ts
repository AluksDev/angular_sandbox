import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@api/defs/User';

@Pipe({
  name: 'sortByLogin'
})
export class SortByLoginPipe implements PipeTransform {


  transform(
    value: User[], 
    isEnabled: boolean,
  ): User[] {
    
    if (!value || !isEnabled) {
      return value;
    }

    const sortedArray = [...value];

    sortedArray.sort((a: any, b: any) => {
      const aValue = a['last_login'];
      const bValue = b['last_login'];
      
      if (aValue === undefined || bValue === undefined) {
          return 0; 
      }

      return String(aValue).localeCompare(String(bValue));
    });

    return sortedArray;
  }
}
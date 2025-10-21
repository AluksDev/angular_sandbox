import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@api/defs/User';

@Pipe({
    name: 'onlyActive'
})

export class OnlyActivePipe implements PipeTransform {
    transform(value: User[], arg: boolean): User[] {
        
        if(arg){
            return value.filter(
                user => user.is_active
            )
        }

        return value;

    }
}
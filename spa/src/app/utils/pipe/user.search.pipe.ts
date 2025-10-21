import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@api/defs/User';

@Pipe({
    name: 'userSearch'
})

export class UserSearchPipe implements PipeTransform {
    transform(value: User[], search: string): User[] {

        if (!search) return value;

        search = search.toLowerCase();

        return value.filter( (user) =>
            user.username.toLocaleLowerCase().includes(search)
        )

    }
}
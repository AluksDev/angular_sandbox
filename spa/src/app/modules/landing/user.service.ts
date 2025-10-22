import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@api/defs/User';
import { environment } from 'environments/environment.hmr';
import { Observable } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _httpClient = inject(HttpClient);


  get(): Observable<User> {
    return this._httpClient.get<User>(`${baseUrl}/v1/auth/me/`, {
        });
  
  }

}

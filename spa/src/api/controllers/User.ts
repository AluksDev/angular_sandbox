/* tslint:disable:max-line-length */

import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { APIConfigService } from '../apiconfig.service';

import * as __utils from '../yasag-utils';

import * as __model from '../model';

export interface ListParams {
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A search term. */
  search?: string;
  /** last_login */
  last_login?: string;
  /** last_login__isnull */
  last_login__isnull?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** List of fields */
  fields?: string;
  /** List of nested objects */
  expand?: string;
}

export interface CurrentParams {
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A search term. */
  search?: string;
  /** last_login */
  last_login?: string;
  /** last_login__isnull */
  last_login__isnull?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** List of fields */
  fields?: string;
  /** List of nested objects */
  expand?: string;
}

export interface ReadParams {
  /** List of fields */
  fields?: string;
  /** List of nested objects */
  expand?: string;
  /** A unique integer value identifying this user. */
  id: number;
}

export interface UpdateParams {
  data: __model.User;
  /** List of fields */
  fields?: string;
  /** List of nested objects */
  expand?: string;
  /** A unique integer value identifying this user. */
  id: number;
}

export interface PartialUpdateParams {
  data: __model.User;
  /** List of fields */
  fields?: string;
  /** List of nested objects */
  expand?: string;
  /** A unique integer value identifying this user. */
  id: number;
}

export interface DisableParams {
  /** List of fields */
  fields?: string;
  /** List of nested objects */
  expand?: string;
  /** A unique integer value identifying this user. */
  id: number;
}

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
    private apiConfigService: APIConfigService) {}


  /** Get a list of reports */
  list(params: ListParams, multipart = false): Observable<__model.UserList> {
    const queryParamBase = {
      ordering: params.ordering,
      search: params.search,
      last_login: params.last_login,
      last_login__isnull: params.last_login__isnull,
      limit: params.limit,
      offset: params.offset,
      fields: params.fields,
      expand: params.expand,
    };

    let queryParams = __utils.getQueryParams(queryParamBase);

    return this.http.get<__model.UserList>(this.apiConfigService.options.apiUrl + `/user/`, {params: queryParams});
  }

  /** Gets user current data */
  current(params: CurrentParams, multipart = false): Observable<__model.User> {
    const queryParamBase = {
      ordering: params.ordering,
      search: params.search,
      last_login: params.last_login,
      last_login__isnull: params.last_login__isnull,
      limit: params.limit,
      offset: params.offset,
      fields: params.fields,
      expand: params.expand,
    };

    let queryParams = __utils.getQueryParams(queryParamBase);

    return this.http.get<__model.User>(this.apiConfigService.options.apiUrl + `/user/current/`, {params: queryParams});
  }

  /** Gets an report */
  read(params: ReadParams, multipart = false): Observable<__model.User> {
    const queryParamBase = {
      fields: params.fields,
      expand: params.expand,
    };

    let queryParams = __utils.getQueryParams(queryParamBase);

    const pathParams = {
      id: params.id,
    };
    return this.http.get<__model.User>(this.apiConfigService.options.apiUrl + `/user/${pathParams.id}/`, {params: queryParams});
  }

  /** Views for User REST */
  update(params: UpdateParams, multipart = false): Observable<__model.User> {
    const bodyParams = params.data;
    const bodyParamsWithoutUndefined = __utils.getBodyParamsWithoutUndefined(multipart, bodyParams);

    const queryParamBase = {
      fields: params.fields,
      expand: params.expand,
    };

    let queryParams = __utils.getQueryParams(queryParamBase);

    const pathParams = {
      id: params.id,
    };
    return this.http.put<__model.User>(this.apiConfigService.options.apiUrl + `/user/${pathParams.id}/`, bodyParamsWithoutUndefined, {params: queryParams});
  }

  /** Views for User REST */
  partialUpdate(params: PartialUpdateParams, multipart = false): Observable<__model.User> {
    const bodyParams = params.data;
    const bodyParamsWithoutUndefined = __utils.getBodyParamsWithoutUndefined(multipart, bodyParams);

    const queryParamBase = {
      fields: params.fields,
      expand: params.expand,
    };

    let queryParams = __utils.getQueryParams(queryParamBase);

    const pathParams = {
      id: params.id,
    };
    return this.http.patch<__model.User>(this.apiConfigService.options.apiUrl + `/user/${pathParams.id}/`, bodyParamsWithoutUndefined, {params: queryParams});
  }

  /** Marks as unactive a user */
  disable(params: DisableParams, multipart = false): Observable<__model.User> {
    const queryParamBase = {
      fields: params.fields,
      expand: params.expand,
    };

    let queryParams = __utils.getQueryParams(queryParamBase);

    const pathParams = {
      id: params.id,
    };
    return this.http.post<__model.User>(this.apiConfigService.options.apiUrl + `/user/${pathParams.id}/disable/`, {}, {params: queryParams});
  }
}

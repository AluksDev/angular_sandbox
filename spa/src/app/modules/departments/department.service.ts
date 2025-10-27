import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Department, DepartmentResponse } from '@api/defs/Department';
import { environment } from 'environments/environment.hmr';
import { map, Observable } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private _httpClient = inject(HttpClient);
  

  /**
     * @public
     * @description Fetches the paginated list of departments from the backend and maps the results 
     * to the view interface by adding a corresponding icon to each department item.
     * @param {string} query - The search string to filter departments.
     * @returns {Observable<DepartmentResponse>} Observable emitting the response 
     * with enriched DepartmentViewItem results.
     */
  getDepartments(query: string): Observable<DepartmentResponse>{

    return this._httpClient.get<DepartmentResponse>(`${baseUrl}/department`, {
      params: {
        search: query
      }
    }).pipe(
      map(departments => {
        const mappedResults: Department[] = departments.results.map(dept => ({
          ...dept,
          icon: this.getDepartmentIcon(dept.id)
        }))
      
      return {
        ...departments,
        results: mappedResults
      }
    }));
  }

  /**
     * @description map a department id to an Angular Material icon
     * @param {number} id - The unique numerical ID of the department
     * @returns {string} The Material Icon name string.
     */
  private getDepartmentIcon(id: number): string {
    switch (id) {
      case 1:
        return 'people';         
      case 2:
        return 'code';          
      case 3:
        return 'business_center'; 
      case 4:
        return 'monetization_on'; 
      case 5:
        return 'medical_services';
      case 6:
        return 'local_shipping'; 
      default:
        return 'apartment';      
    }
  }


}

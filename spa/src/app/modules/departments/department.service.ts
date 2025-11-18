import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Department, DepartmentCreate, DepartmentResponse, DepartmentUpdate } from '@api/defs/Department';
import { NotificationService } from '@utils/services/notification.service';
import { environment } from 'environments/environment.hmr';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private _httpClient = inject(HttpClient);
  private _notificationService = inject(NotificationService);
  private router = inject(Router);
  

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
    * Create a new department
    * @param department the data object
    * @returns An Observable that emits the newly created department object
    * 
    * @throws {Error} If the department name already exists or if there's a database error.
    */
  create(department: DepartmentCreate): Observable<Department>{    
    const { name , code = ''} = department;

    return this._httpClient.post<Department>(`${baseUrl}/department/`, {
      name: name,
      code: code
    }).pipe(
      tap(() => {
        this.handleRefresh('Departamento creado exitosamente');
      }),
      catchError((error:any) =>{
        const transformedError = this.handleError(error);
        
        return throwError(() => transformedError);
      })
    );

  }

  /**
   * Update a department
   * @param id the unique id of the department
   * @param department the filds to update
   * @returns An Observable that emits the updated department object
   */
  update(id: number, department: DepartmentUpdate): Observable<Department>{

    const {name, code} = department;

    return this._httpClient.patch<Department>(`${baseUrl}/department/${id}/`, {
      name: name,
      code: code
    }).pipe(
      tap(()=> {
        this.handleRefresh('Departamento actualizado exitosamente');
      }),
      catchError((error:any) =>{
        const transformedError = this.handleError(error);
        
        return throwError(() => transformedError);
      })
    );

  } 

  /**
   * Delete a department from the system using its unique ID.
   * @param id the unique id of the department
   * @returns 
   */
  delete(id: number): Observable<void>{
    return this._httpClient.delete<void>(`${baseUrl}/department/${id}`).pipe(
      tap(()=> {
        this.handleRefresh('Departamento eliminado exitosamente');
      })
    );
  }

  /**
   * Performs a soft refresh or reload of the current Angular route and displays 
   * a success notification message to the user.
   * * @private
   * @param {string} message The success message to be shown in the notification.
   * @returns {void}
   */
  private handleRefresh( message: string): void{
    const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
        });
        this._notificationService.showSuccess(message);
  }

  /**
   * Handles HTTP errors received from the API and transforms them into a consistent
   * application-specific error format (AppError).
   *
   * @private
   * @param error - The raw error
   * @returns An object with custom status and message
   */
  private handleError(error: any){

    if(error.status == 400){
      return {
        statusCode: 500,
        message: 'Ya existe departamento con ese nombre'
    };
    }
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

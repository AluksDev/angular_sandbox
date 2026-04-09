import { Injectable } from '@angular/core';
import { Department } from '@app/shared/interfaces/department.interface';
import { Observable, of } from 'rxjs';

const MOCK_DEPARTMENTS: Department[] = [
  { id: 1, name: 'Information Technology', code: 'IT' },
  { id: 2, name: 'Human Resources', code: 'HR' },
  { id: 3, name: 'Finance', code: 'FIN' },
  { id: 4, name: 'Marketing', code: 'MKT' },
  { id: 5, name: 'Sales', code: 'SAL' },
  { id: 6, name: 'Customer Support', code: 'CS' },
  { id: 7, name: 'Legal', code: 'LEG' },
  { id: 8, name: 'Operations', code: 'OPS' },
  { id: 9, name: 'Research and Development', code: 'R&D' },
  { id: 10, name: 'Administration', code: 'ADM' },
  { id: 11, name: 'Logistics', code: 'LOG' },
  { id: 12, name: 'Procurement', code: 'PRC' },
  { id: 13, name: 'Quality Assurance', code: 'QA' },
  { id: 14, name: 'Business Intelligence', code: 'BI' },
  { id: 15, name: 'Product Management', code: 'PM' }
];

@Injectable({providedIn: 'root'})
export class DepartmentsService {
    getDepartments(): Observable<any> {
        const departments = MOCK_DEPARTMENTS;
        return of(departments);
    }
    
}
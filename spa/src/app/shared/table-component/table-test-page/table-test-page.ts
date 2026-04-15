import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TableComponent } from "../table-component";
import { MatTableDataSource } from '@angular/material/table';
import { JsonPipe } from '@angular/common';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA = [
  { id: 1, fullName: 'Alice Johnson', age: 28, role: 'Frontend Developer' },
  { id: 2, fullName: 'Bruno Silva', age: 34, role: 'Backend Developer' },
  { id: 3, fullName: 'Carla Mendes', age: 25, role: 'UI/UX Designer' },
  { id: 4, fullName: 'Daniel Smith', age: 41, role: 'DevOps Engineer' },
  { id: 5, fullName: 'Elena García', age: 30, role: 'Product Manager' },
  { id: 6, fullName: 'Felix Brown', age: 22, role: 'Intern' },
  { id: 7, fullName: 'Giulia Rossi', age: 29, role: 'Full Stack Developer' },
  { id: 8, fullName: 'Hiro Tanaka', age: 37, role: 'Software Architect' },
  { id: 9, fullName: 'Isabella Costa', age: 31, role: 'QA Engineer' },
  { id: 10, fullName: 'John Miller', age: 26, role: 'Mobile Developer' }
];

@Component({
  selector: 'app-table-test-page',
  imports: [TableComponent],
  templateUrl: './table-test-page.html',
  styleUrl: './table-test-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTestPage {
  displayedColumns = [
  { key: 'id', label: 'ID' },
  { key: 'fullName', label: 'Full Name', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
  { key: 'role', label: 'Role', sortable: true }
];

  actions = [
    {key: 'details', label: 'Details'},
    {key: 'edit', label: 'Edit'},
    {key: 'deactivate', label: 'Deactivate'},
  ]
  dataSource = ELEMENT_DATA;

  sortColumns(event: Sort){
    console.log(event)
  }
  changePage(event: PageEvent){
    console.log(event)
  }
 }

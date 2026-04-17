import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DepartmentsService } from '../../departments.service';
import {  Department } from '@api/departments/DTOs/department.interface';
import { DepartmentCardComponent } from '../../components/department-card-component/department-card-component';
import { MatDialog } from '@angular/material/dialog';
import { NewDepartmentDialog } from '../../components/new-department-dialog/new-department-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDepartmentDialog } from '../../components/delete-department-dialog/delete-department-dialog';
import { EditDepartmentDialog } from '../../components/edit-department-dialog/edit-department-dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-departments-page',
  imports: [DepartmentCardComponent, MatButtonModule],
  templateUrl: './departments-page.html',
  styleUrl: './departments-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentsPage implements OnInit{
  departmentService = inject(DepartmentsService);
  _snackBar = inject(MatSnackBar);
  totalDeps = signal<number>(0);
  departments = signal<Department[]>([]);
  
  ngOnInit(): void {
   this.loadDepartments();
  }

  dialog = inject(MatDialog);
  openAddDepDialog(){
    const dialogRef = this.dialog.open(NewDepartmentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const { name, code } = result;
        const message = `${name}${code ? ` (${code})` : ''} department added correctly`;
        this.openSnackBar(message, 'Close');
        this.loadDepartments();
      }
    })
  }

  loadDepartments() {
     this.departmentService.getDepartments().subscribe(res => {
      if (res.count) this.totalDeps.set(res.count);
      if (res.results.length) this.departments.set(res.results);
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }

  onDepCardAction(event: {dep: Department, action: string}){
    const { dep, action } = event;
    if (action === 'delete'){
      this.deleteDepartment(dep);
    } else {
      this.updateDepartment(dep);
    }
  }

  deleteDepartment(dep: Department){
    const dialogRef = this.dialog.open(DeleteDepartmentDialog, {
        data: dep,
      });
      dialogRef.afterClosed().subscribe((message) => {
        this.openSnackBar(message, 'Close');
        this.loadDepartments();
      })
  }

  updateDepartment(dep: Department) {
    const dialogRef = this.dialog.open(EditDepartmentDialog, {
      data: dep,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.error){
        this.openSnackBar(result.message, 'Close');
      } else {
        const message = `Department: ${result.data.name} updated correctly`;
        this.openSnackBar(message, 'Close');
        this.loadDepartments();
      }
    })
  }
 }
